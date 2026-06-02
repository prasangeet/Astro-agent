from tools.geocode import geocode_tool
from tools.birth_chart import birth_chart_tool
from tools.knowledge_tool import knowledge_lookup_tool
from tools.transits import transit_tool

ALL_TOOLS = [geocode_tool, birth_chart_tool, transit_tool, knowledge_lookup_tool]

TOOL_REGISTRY = {tool.name: tool for tool in ALL_TOOLS}

TOOLS = list(TOOL_REGISTRY.values())
