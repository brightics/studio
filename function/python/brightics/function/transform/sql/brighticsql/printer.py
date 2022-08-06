"""
    Copyright 2019 Samsung SDS

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
"""

from brighticsql.base import VisitorABC


class RelVisitPrinter(VisitorABC):
    """Visit rel and print content."""

    def __init__(self):
        self.stack = []

    def tostring(self, relroot):
        relroot.accept(self)
        return '\n'.join(self.stack)

    def visit(self, rel):
        self.print_rel(rel, 0)

    def print_rel(self, rel, level=0):
        h = '  ' * level
        self.stack.append(h + str(rel))
        for r in rel.inputs:
            self.print_rel(r, level + 1)
