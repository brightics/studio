from .base import VisitorABC


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
