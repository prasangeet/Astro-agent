import json
import statistics
import time
from pathlib import Path

from graph.agent import run_agent

from graph.llm import eval_llm
from core.settings import EVAL_PROMPT


def load_cases():
    path = Path("evals/golden_set.jsonl")

    with open(path) as f:
        return [json.loads(line) for line in f if line.strip()]


def judge_response(
    query: str,
    response: str,
):
    prompt = EVAL_PROMPT.replace(
        "{query}",
        query,
    ).replace(
        "{response}",
        response,
    )

    result = eval_llm.invoke(
        prompt,
    )

    try:
        content = result.content.strip()

        if content.startswith("```json"):
            content = content.replace("```json", "").replace("```", "").strip()

        elif content.startswith("```"):
            content = content.replace("```", "").strip()

        return json.loads(content)

    except Exception as e:
        print(f"Judge parse failed: {e}")

        print("Judge output:")

        print(result.content)

        return {
            "relevance": 0,
            "helpfulness": 0,
            "tone": 0,
            "astrological_grounding": 0,
            "safety": 0,
            "overall": 0,
            "reason": "Judge parsing failed",
        }


def save_results(results):
    Path("evals/results.json").write_text(
        json.dumps(
            results,
            indent=2,
        )
    )


def print_scorecard(results):
    total_cases = len(results)

    reliability = sum(result["success"] for result in results) / total_cases * 100

    avg_latency = statistics.mean(result["latency_ms"] for result in results)

    judge_scores = [
        result["judge"]["overall"] for result in results if result["success"]
    ]

    avg_judge_score = statistics.mean(judge_scores) if judge_scores else 0

    tool_cases = [result for result in results if result["expected_tools"]]

    tool_accuracy = (
        sum(result["tool_match"] for result in tool_cases) / len(tool_cases) * 100
        if tool_cases
        else 0
    )

    safety_scores = [
        result["judge"]["safety"] for result in results if result["success"]
    ]

    avg_safety = statistics.mean(safety_scores) if safety_scores else 0

    final_score = (
        tool_accuracy * 0.30
        + (avg_judge_score / 5 * 100) * 0.30
        + reliability * 0.20
        + (avg_safety / 5 * 100) * 0.10
        + max(
            0,
            100 - avg_latency / 100,
        )
        * 0.10
    )

    print()
    print("=" * 70)
    print("ASTROAGENT EVALUATION SCORECARD")
    print("=" * 70)

    print(f"Cases Run          : {total_cases}")
    print(f"Reliability        : {reliability:.2f}%")
    print(f"Tool Accuracy      : {tool_accuracy:.2f}%")
    print(f"Judge Score        : {avg_judge_score:.2f}/5")
    print(f"Safety Score       : {avg_safety:.2f}/5")
    print(f"Average Latency    : {avg_latency:.2f} ms")

    print("-" * 70)

    print(f"FINAL SCORE        : {final_score:.2f}/100")

    print("=" * 70)
    print()


def main():
    cases = load_cases()

    results = []

    for case in cases:
        print(f"Running case {case['id']}...")

        start = time.perf_counter()

        try:
            result = run_agent(
                user_id=case.get(
                    "user_id",
                    1,
                ),
                message=case["query"],
            )

            response = result["response"]

            actual_tools = result.get(
                "tool_calls",
                [],
            )

            success = True
            error = None

        except Exception as e:
            response = ""
            actual_tools = []

            success = False
            error = str(e)

        latency_ms = (time.perf_counter() - start) * 1000

        expected_tools = case.get(
            "expected_tools",
            [],
        )

        tool_match = (
            set(expected_tools).issubset(set(actual_tools)) if expected_tools else True
        )

        judge = (
            judge_response(
                case["query"],
                response,
            )
            if success
            else {
                "overall": 0,
                "safety": 0,
            }
        )

        results.append(
            {
                "id": case["id"],
                "category": case["category"],
                "query": case["query"],
                "success": success,
                "tool_match": tool_match,
                "expected_tools": expected_tools,
                "actual_tools": actual_tools,
                "latency_ms": round(
                    latency_ms,
                    2,
                ),
                "response": response,
                "judge": judge,
                "error": error,
            }
        )

    save_results(results)

    print_scorecard(results)


if __name__ == "__main__":
    main()
