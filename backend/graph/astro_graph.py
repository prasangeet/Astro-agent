from langgraph.graph import StateGraph

from langgraph.prebuilt import tools_condition

from graph.state import AgentState
from graph.nodes import agent_node
from graph.tools import tool_node


builder = StateGraph(AgentState)

builder.add_node(
    "agent",
    agent_node,
)

builder.add_node(
    "tools",
    tool_node,
)

builder.set_entry_point(
    "agent",
)

builder.add_conditional_edges(
    "agent",
    tools_condition,
)

builder.add_edge(
    "tools",
    "agent",
)

graph = builder.compile()
