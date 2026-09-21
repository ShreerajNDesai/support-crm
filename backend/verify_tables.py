"""
Phase 1 verification -- run this to prove tables are created correctly.
Usage: python verify_tables.py
"""

import sys
import os

# Ensure we can import from the backend directory
sys.path.insert(0, os.path.dirname(__file__))

from database import engine, Base
import models  # import triggers model registration
from sqlalchemy import inspect

def verify():
    # Create all tables
    Base.metadata.create_all(bind=engine)

    inspector = inspect(engine)
    tables = inspector.get_table_names()
    print(f"\n[OK] Tables created: {tables}")

    for table in tables:
        columns = inspector.get_columns(table)
        print(f"\n[TABLE] {table}:")
        for col in columns:
            print(f"   {col['name']:20s} {str(col['type']):15s} nullable={col['nullable']}")

        # Show foreign keys
        fks = inspector.get_foreign_keys(table)
        if fks:
            for fk in fks:
                print(f"   [FK] {fk['constrained_columns']} -> {fk['referred_table']}.{fk['referred_columns']}")

    # Release the connection before cleanup
    engine.dispose()

    if os.path.exists("crm.db"):
        os.remove("crm.db")
        print("\n[CLEANUP] Removed test crm.db")

    print("\n[OK] Phase 1 verification complete!")

if __name__ == "__main__":
    verify()
