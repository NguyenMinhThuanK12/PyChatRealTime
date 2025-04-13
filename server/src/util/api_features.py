from src import db
from sqlalchemy import desc


class APIFeatures:
    def __init__(self, model, args):
        args = args.to_dict()
        self.model = model
        self.sort_by = args.pop('sort_by', None)
        self.fields = args.pop('fields', None)
        self.page = int(args.pop('page', 1))
        self.per_page = int(args.pop('per_page', 100))
        self.filters = args

    def filter_query(self, query, filters):
        """Apply filters to the query."""
        operators = {
            'eq': lambda field, val: getattr(self.model, field) == val,
            'ne': lambda field, val: getattr(self.model, field) != val,
            'lt': lambda field, val: getattr(self.model, field) < val,
            'le': lambda field, val: getattr(self.model, field) <= val,
            'gt': lambda field, val: getattr(self.model, field) > val,
            'ge': lambda field, val: getattr(self.model, field) >= val,
            'in': lambda field, val: getattr(self.model, field).in_(val.split(',')),
            'like': lambda field, val: getattr(self.model, field).like(val),
            'ilike': lambda field, val: getattr(self.model, field).ilike(val),
            'is_null': lambda field, val: getattr(self.model, field).is_(None) if val.lower() == 'true' else getattr(self.model, field).isnot(None)
            # Add more cases as needed
        }

        for field, value in filters.items():
            # check field is enum
            if hasattr(self.model, field) and hasattr(getattr(self.model, field).property, 'columns'):
                value = value.upper()
            if isinstance(value, str) and ':' in value:
                op, val = value.split(':')
                op = op.lower()
                if op in operators:
                    query = query.filter(operators[op](field, val))
            else:
                # Default to equality operator
                query = query.filter(getattr(self.model, field) == value)

        return query

    def sort_query(self, query, sort_by):
        """Apply sorting to the query."""
        if sort_by:
            if sort_by.startswith('-'):
                query = query.order_by(desc(sort_by[1:]))
            else:
                query = query.order_by(sort_by)
        return query

    def select_fields(self, query, fields):
        """Select specific fields from the query."""
        if fields:
            fields = fields.split(',')

            query = query.with_entities(
                *[getattr(self.model, field) for field in fields])
        return query

    def paginate_query(self, query, page=1, per_page=100):
        """Paginate the query."""
        return query.paginate(page=page, per_page=per_page)

    def perform_query(self, query=None):
        """Perform the query with optional filtering, sorting, field selection, and pagination."""
        if query is None:
            query = db.session.query(self.model)
        if self.filters:
            query = self.filter_query(query, self.filters)
        if self.sort_by:
            query = self.sort_query(query, self.sort_by)
        if self.fields:
            query = self.select_fields(query, self.fields)

        paginated_query = self.paginate_query(query, self.page, self.per_page)
        items = paginated_query.items
        total_count = paginated_query.total

        return items, total_count
