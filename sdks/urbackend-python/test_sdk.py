"""
urBackend Python SDK — Live Integration Test Script.

This script verifies the SDK works against a real urBackend instance.

BEFORE RUNNING:
1. Replace API_KEY with your real pk_live_... key from the dashboard
2. Replace COLLECTION with a collection that exists in your project
3. Ensure auth is enabled and a test user exists (or sign_up will create one)

Usage:
    cd sdks/urbackend-python
    pip install -e .
    python test_sdk.py
"""

import sys
import os

# Ensure we import the local SDK, not any installed version
sys.path.insert(0, os.path.dirname(__file__))

from urbackend import UrBackendClient, AuthError, NotFoundError, ValidationError

# ────────────────────────────────────────────────────────────────
#  CONFIG — Replace these with your actual values
# ────────────────────────────────────────────────────────────────
API_KEY    = "pk_live_BJMxC8RXuUmHyUEBvyAkU5fs_EnNVQgmc-3x_CPwd2g"        # ← your publishable key
BASE_URL   = "https://api.ub.bitbros.in"    # ← or http://localhost:1235
EMAIL      = "navyasree_ulava@srmap.edu.in"
PASSWORD   = "Navya@12345"
COLLECTION = "posts"                         # ← a collection in your project


def separator(title: str) -> None:
    print(f"\n{'=' * 60}")
    print(f"  {title}")
    print(f"{'=' * 60}")


def main():
    # ── 1. CONNECT ──────────────────────────────────────────────
    separator("1. Connect")
    client = UrBackendClient(api_key=API_KEY, base_url=BASE_URL)
    print(f"✅ Client created with base_url={BASE_URL}")
    print(f"   api_key starts with: {API_KEY[:12]}...")

    # ── 2. SIGN UP (idempotent — may already exist) ─────────────
    separator("2. Sign Up")
    try:
        result = client.auth.sign_up(EMAIL, PASSWORD, username="sdk_tester")
        print(f"✅ Signed up: {result}")
    except (AuthError, ValidationError) as e:
        print(f"ℹ️  Sign-up skipped (user likely exists): {e.message}")

    # ── 3. LOGIN ────────────────────────────────────────────────
    separator("3. Login")
    try:
        session = client.auth.login(EMAIL, PASSWORD)
        print(f"✅ Login successful!")
        print(f"   accessToken: {session.get('accessToken', 'N/A')[:40]}...")
        print(f"   expiresIn:   {session.get('expiresIn', 'N/A')}")
    except AuthError as e:
        print(f"❌ Login failed: {e.message}")
        print("   Cannot continue without login. Exiting.")
        sys.exit(1)

    # ── 4. TOKEN AUTO-STORAGE ───────────────────────────────────
    separator("4. Token Auto-Storage")
    stored_token = client.auth.get_token()
    if stored_token:
        print(f"✅ Token auto-stored after login: {stored_token[:40]}...")
    else:
        print("❌ Token NOT stored — this is a bug!")
        sys.exit(1)

    # ── 5. GET CURRENT USER (ME) ────────────────────────────────
    separator("5. Get Current User (/me)")
    try:
        me = client.auth.me()  # no token arg needed — auto-uses stored token
        print(f"✅ Current user: {me.get('email', 'N/A')}")
        print(f"   _id: {me.get('_id', 'N/A')}")
    except AuthError as e:
        print(f"❌ /me failed: {e.message}")

    # ── 6. INSERT DOCUMENT ──────────────────────────────────────
    separator("6. Insert Document")
    try:
        doc = client.db.insert(
            COLLECTION,
            {"title": "SDK Test Post", "content": "Created by Python SDK test_sdk.py"},
            token=client.auth.get_token(),
        )
        doc_id = doc.get("_id")
        print(f"✅ Inserted document: _id={doc_id}")
        print(f"   Full response: {doc}")
    except Exception as e:
        print(f"❌ Insert failed: {e}")
        doc_id = None

    # ── 7. FETCH ALL DOCUMENTS ──────────────────────────────────
    separator("7. Fetch All Documents (get_all)")
    try:
        all_docs = client.db.get_all(COLLECTION, limit=5, sort="createdAt:desc")
        print(f"✅ Fetched {len(all_docs)} documents")
        for i, d in enumerate(all_docs[:3]):
            print(f"   [{i}] _id={d.get('_id')}, title={d.get('title', 'N/A')}")
    except Exception as e:
        print(f"❌ get_all failed: {e}")

    # ── 8. CHAINABLE COLLECTION API ─────────────────────────────
    separator("8. Chainable Collection API (find)")
    try:
        results = client.db.collection(COLLECTION).find(
            {"title": "SDK Test Post"}, limit=5
        )
        print(f"✅ collection().find() returned {len(results)} docs")
    except Exception as e:
        print(f"❌ collection().find() failed: {e}")

    # ── 9. GET ONE DOCUMENT ─────────────────────────────────────
    if doc_id:
        separator("9. Get One Document")
        try:
            single = client.db.get_one(COLLECTION, doc_id)
            print(f"✅ get_one returned: title={single.get('title')}")
        except NotFoundError:
            print(f"❌ Document {doc_id} not found")
        except Exception as e:
            print(f"❌ get_one failed: {e}")

    # ── 10. PATCH DOCUMENT ──────────────────────────────────────
    if doc_id:
        separator("10. Patch Document")
        try:
            patched = client.db.patch(
                COLLECTION, doc_id,
                {"title": "SDK Test Post — PATCHED"},
                token=client.auth.get_token(),
            )
            print(f"✅ Patched: title={patched.get('title')}")
        except Exception as e:
            print(f"❌ Patch failed: {e}")

    # ── 11. DELETE DOCUMENT ─────────────────────────────────────
    if doc_id:
        separator("11. Delete Document")
        try:
            del_result = client.db.delete(
                COLLECTION, doc_id,
                token=client.auth.get_token(),
            )
            print(f"✅ Deleted: {del_result}")
        except Exception as e:
            print(f"❌ Delete failed: {e}")

    # ── 12. COUNT DOCUMENTS ─────────────────────────────────────
    separator("12. Count Documents")
    try:
        total = client.db.count(COLLECTION)
        print(f"✅ Total documents in '{COLLECTION}': {total}")
    except Exception as e:
        print(f"❌ Count failed: {e}")

    # ── 13. EDGE CASE: INVALID LOGIN ────────────────────────────
    separator("13. Edge Case: Invalid Login")
    try:
        client.auth.login("nonexistent@example.com", "wrongpassword")
        print("❌ Should have raised AuthError!")
    except AuthError as e:
        print(f"✅ Correctly raised AuthError: {e.message}")
    except Exception as e:
        print(f"⚠️  Unexpected error type: {type(e).__name__}: {e}")

    # ── 14. EDGE CASE: MISSING TOKEN ────────────────────────────
    separator("14. Edge Case: Missing Token (me without login)")
    fresh_client = UrBackendClient(api_key=API_KEY, base_url=BASE_URL)
    try:
        fresh_client.auth.me()
        print("❌ Should have raised AuthError!")
    except AuthError as e:
        print(f"✅ Correctly raised AuthError: {e.message}")

    # ── 15. EDGE CASE: EMPTY QUERY ──────────────────────────────
    separator("15. Edge Case: Empty Collection Query")
    try:
        empty_results = client.db.get_all("nonexistent_collection_xyz")
        print(f"✅ Empty collection returns: {empty_results} (type={type(empty_results).__name__})")
    except Exception as e:
        print(f"   Raised: {type(e).__name__}: {e}")

    # ── 16. LOGOUT ──────────────────────────────────────────────
    separator("16. Logout")
    result = client.auth.logout()
    print(f"✅ Logged out: {result}")
    print(f"   Token after logout: {client.auth.get_token()}")

    # ── DONE ────────────────────────────────────────────────────
    separator("ALL TESTS COMPLETE")
    print("🎉 Python SDK verification finished.\n")
    client.close()


if __name__ == "__main__":
    main()
"""Description": "Live integration test script that tests every SDK function against a real urBackend instance"
"""
