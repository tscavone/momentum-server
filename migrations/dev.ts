import { MigrationInterface } from "mongo-migrate-ts";
import { Db } from "mongodb";

export class MyMigration implements MigrationInterface {
  async up(db: Db): Promise<any> {
    await db.createCollection("users");
  }

  async down(db: Db): Promise<any> {
    await db.dropCollection("users");
  }
}
