import { getSession } from "@/lib/sessions";
import { redirect } from "next/navigation";
import React from "react";

const Dashboard = async () => {
  const session = await getSession();
  if (!session || !session.user) redirect("/auth/signin");

  // if (session.user.role !== "ADMIN")
  //   return (
  //  <div>
  //     <h1>Dashboard</h1>
  //     <p>Welcome, {session.user.name}!</p>
  //     <p>Your Role: {session.user.role}!</p>
  //     <p>Your ID: {session.user.id}</p>
  //     <p>Your access token: {session.accessToken}</p>
  //     <p>Your refresh token: {session.refreshToken}</p>
  //   </div>
  //   )

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {session.user.name}!</p>
      <p>Your Role: {session.user.role}!</p>
      <p>Your ID: {session.user.id}</p>
      <p>Your access token: {session.accessToken}</p>
      <p>Your refresh token: {session.refreshToken}</p>
    </div>
  );
};

export default Dashboard;
