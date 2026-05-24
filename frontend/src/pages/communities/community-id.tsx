import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "@clerk/react";
import { useCommunityQuery, useDeleteCommunityMutation } from "../../hooks/useCommunities";
import {
  useJoinCommunityMutation,
  useLeaveCommunityMutation,
  useMembersQuery,
  useCommunityRequestsQuery,
  useHandleRequestMutation,
} from "../../hooks/useMembership";
import { useState } from "react";
import type { MembershipRequest } from "../../types/community";

const CommunityDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: clerkUser } = useUser();

  const { data: community, isLoading: communityLoading, isError: communityError } = useCommunityQuery(id || "");

  const { data: members = [], isLoading: membersLoading } = useMembersQuery(id || "");

  const [activeTab, setActiveTab] = useState<"overview" | "members" | "requests">("overview");

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // --- Derived state from schema relations ---
  const userMembership = members.find((m) => m.userId === clerkUser?.id);
  const isCreator = community?.createdById === clerkUser?.id;
  const isOwner = userMembership?.role === "OWNER";
  const isAdmin = userMembership?.role === "ADMIN" || isOwner;
  const isMember = !!userMembership;

  const { data: requests = [], isLoading: requestsLoading } = useCommunityRequestsQuery(id || "");

  const joinMutation = useJoinCommunityMutation();
  const leaveMutation = useLeaveCommunityMutation();
  const deleteMutation = useDeleteCommunityMutation();
  const handleRequestMutation = useHandleRequestMutation();

  // --- Handlers ---
  const handleJoin = async () => {
    try { await joinMutation.mutateAsync(id!) }
    catch (e) { console.error(e) }
  };

  const handleLeave = async () => {
    if (!confirm("Are you sure you want to leave this community?")) return;
    try { await leaveMutation.mutateAsync(id!) }
    catch (e) { console.error(e) }
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(id!);
      navigate("/communities");
    } catch (e) { console.error(e) }
  };

  const handleRequest = async (requestId: string, status: "APPROVED" | "REJECTED") => {
    try { await handleRequestMutation.mutateAsync({ communityId: id!, requestId, status }) }
    catch (e) { console.error(e) }
  };

  // --- Loading / Error states ---
  if (communityLoading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-gray-600">Loading community...</div>
    </div>
  );

  if (communityError || !community) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-red-600">Community not found</div>
    </div>
  );

  const adminCount = members.filter((m) => m.role === "ADMIN" || m.role === "OWNER").length;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Hero ── */}
      <div className="bg-white shadow">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="flex gap-8">
            <img
              src={community.imageUrl || "/default-community.png"}
              alt={community.name}
              className="w-40 h-40 object-cover rounded-lg flex-shrink-0"
            />

            <div className="flex-1">
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-3">
                {community.category}
              </span>

              <h1 className="text-3xl font-bold text-gray-900 mb-1">{community.name}</h1>
              <p className="text-gray-500 mb-1">📍 {community.location}</p>
              <p className="text-gray-500 mb-4">👥 {members.length} members</p>

              {/* ── Action Buttons ── */}
              <div className="flex flex-wrap gap-3">
                {!isMember && (
                  <button
                    onClick={handleJoin}
                    disabled={joinMutation.isPending}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition"
                  >
                    {joinMutation.isPending ? "Joining..." : "Join Community"}
                  </button>
                )}

                {isMember && (
                  <span className="px-4 py-2 bg-green-100 text-green-800 rounded-lg font-medium">
                    ✓ {userMembership?.role}
                  </span>
                )}

                {isCreator && (
                  <>
                    <button
                      onClick={() => navigate(`/communities/${id}/edit`)}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition"
                    >
                      🗑️ Delete
                    </button>
                  </>
                )}

                {isMember && !isCreator && (
                  <button
                    onClick={handleLeave}
                    disabled={leaveMutation.isPending}
                    className="px-6 py-2 bg-red-100 text-red-600 rounded-lg font-medium hover:bg-red-200 disabled:opacity-50 transition"
                  >
                    {leaveMutation.isPending ? "Leaving..." : "Leave"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="max-w-5xl mx-auto px-4 mt-8">
        <div className="border-b border-gray-200 mb-6">
          <div className="flex gap-8">
            {(["overview", "members"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 font-medium capitalize transition ${
                  activeTab === tab
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab === "members" ? `Members (${members.length})` : tab}
              </button>
            ))}

            {isAdmin && (
              <button
                onClick={() => setActiveTab("requests")}
                className={`pb-4 font-medium transition relative ${
                  activeTab === "requests"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Requests
                {requests.length > 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                    {requests.length}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>

        {/* ── Overview Tab ── */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">About</h3>
              <p className="text-gray-600 leading-relaxed">{community.description}</p>
              <div className="mt-6 space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="font-medium text-gray-900">{community.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium text-gray-900">{community.location}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Created</p>
                  <p className="font-medium text-gray-900">
                    {new Date(community.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Stats</h3>
              <div className="space-y-4">
                {[
                  { label: "Total Members", value: members.length },
                  { label: "Admins", value: adminCount },
                  { label: "Pending Requests", value: requests.length },
                  { label: "Total Events", value: community.events?.length ?? 0 },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-gray-600">{label}</span>
                    <span className="font-bold text-gray-900">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Members Tab ── */}
        {activeTab === "members" && (
          <div className="bg-white rounded-lg shadow mb-8 overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {["Name", "Email", "Role", "Joined", ...(isAdmin ? ["Actions"] : [])].map((h) => (
                    <th key={h} className="px-6 py-3 text-left text-sm font-semibold text-gray-900">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {membersLoading ? (
                  <tr><td colSpan={isAdmin ? 5 : 4} className="px-6 py-4 text-center text-gray-600">Loading members...</td></tr>
                ) : members.length === 0 ? (
                  <tr><td colSpan={isAdmin ? 5 : 4} className="px-6 py-4 text-center text-gray-600">No members yet</td></tr>
                ) : (
                  members.map((member) => (
                    <tr key={member.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={member.user?.imageUrl || "/default-avatar.png"}
                            alt={member.user?.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <span className="font-medium text-gray-900">{member.user?.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{member.user?.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          member.role === "OWNER" ? "bg-purple-100 text-purple-800"
                          : member.role === "ADMIN" ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                        }`}>
                          {member.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(member.createdAt).toLocaleDateString()}
                      </td>
                      {isAdmin && (
                        <td className="px-6 py-4">
                          {member.role !== "OWNER" && (
                            <div className="flex gap-2">
                              {isOwner && (
                                <button className="px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition">
                                  {member.role === "ADMIN" ? "Demote" : "Promote"}
                                </button>
                              )}
                              <button className="px-3 py-1 text-sm bg-red-100 text-red-600 rounded hover:bg-red-200 transition">
                                Remove
                              </button>
                            </div>
                          )}
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Requests Tab ── */}
        {activeTab === "requests" && isAdmin && (
          <div className="bg-white rounded-lg shadow mb-8">
            {requestsLoading ? (
              <div className="p-6 text-center text-gray-600">Loading requests...</div>
            ) : requests.length === 0 ? (
              <div className="p-6 text-center text-gray-600">No pending requests</div>
            ) : (
              <div className="divide-y divide-gray-200">
                {requests.map((request: MembershipRequest) => (
                  <div key={request.id} className="p-6 flex items-center justify-between hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                      <img
                        src={request.user?.imageUrl || "/default-avatar.png"}
                        alt={request.user?.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{request.user?.name}</p>
                        <p className="text-sm text-gray-600">{request.user?.email}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Requested {new Date(request.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleRequest(request.id, "APPROVED")}
                        disabled={handleRequestMutation.isPending}
                        className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium hover:bg-green-200 disabled:opacity-50 transition"
                      >
                        ✓ Approve
                      </button>
                      <button
                        onClick={() => handleRequest(request.id, "REJECTED")}
                        disabled={handleRequestMutation.isPending}
                        className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 disabled:opacity-50 transition"
                      >
                        ✕ Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Delete Confirm Modal ── */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Community?</h3>
            <p className="text-gray-600 mb-6">
              This action cannot be undone. All members, requests, and events linked to this community will be affected.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 transition"
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityDetail;