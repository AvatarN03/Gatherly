import { useUser } from "@clerk/react";
import { useMyEventRolesQuery, useMyEventsQuery, useMyRegistrationsQuery } from "./useEvents";
import { useMyMembershipRequestsQuery, useMyMembershipsQuery } from "./useMembership";
import type { Membership } from "../types";

export const useDashboard = () => {
  const { user } = useUser();

  // Communities where user is OWNER or ADMIN
  const { data: myMembershipsRequests = [], isLoading: membershipsLoading } = useMyMembershipRequestsQuery();

  const { data: myMemberships = [] } = useMyMembershipsQuery();

  // Events the user created
  const { data: createdEvents = [], isLoading: eventsLoading } = useMyEventsQuery();

  // User's own event registrations
  const { data: myRegistrations = [] } = useMyRegistrationsQuery();

  // Event roles assigned to user (EventMember)
  const { data: myEventRoles = [] } = useMyEventRolesQuery();

  const adminMemberships = myMemberships.filter(
    (m: Membership) => m.role === "OWNER" || m.role === "ADMIN"
  );

  const isLoading = membershipsLoading || eventsLoading;

  return {
    user,
    adminMemberships,
    myMemberships,
    myMembershipsRequests,
    createdEvents,
    myRegistrations,
    myEventRoles,
    isLoading,
  };
};