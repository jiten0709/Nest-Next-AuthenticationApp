import { getProfile } from "@/lib/actions";
import React from "react";

const ProfilePage = async () => {
  const res = await getProfile();

  console.log("res: ", res);

  return (
    <div>
      ProfilePage
      <p>{JSON.stringify(res)}</p>
    </div>
  );
};

export default ProfilePage;
