SQL DB Keys
Admin:
0 = Basic
1 = Admin

Priority:
0 = Low
1 = Medium
2 = High

Type:
0 = Issue
1 = Feature
2 = Bug Fix

Status:
0 = Unresolved
1 = In progress
2 = Resolved

Assignee:
x = user_id

Role: (affects permissions)
0 = Dev
1 = Admin

issues:
storing stuff in local session - user can pose as different users
format dates better (prevent ability to set past date as project deadline)
arbitrary pattern for sending SQL info for now - ids send via req.params, everything else req.body
