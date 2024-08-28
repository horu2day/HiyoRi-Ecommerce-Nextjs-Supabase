import db from "../db";
import * as schema from "../schema";

const profiles = [
  {
    id: "02b6ecb6-f7a8-463f-9230-75c6cc48f492", // orders 테이블에서 참조하는 ID
    name: "Test User",
    email: "testuser@example.com",
    // 다른 필요한 필드들...
  },
  // 다른 프로필들...
];

const seedProfiles = async () => {
  try {
    await db.delete(schema.profiles);
    const insertedProfiles = await db
      .insert(schema.profiles)
      .values(profiles)
      .returning();
    console.log(`${insertedProfiles.length} profiles added to the DB.`);
  } catch (err) {
    console.error("Error happened while inserting profiles", err);
  }
};

export default seedProfiles;
