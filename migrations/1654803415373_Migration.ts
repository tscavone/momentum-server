import { Db } from "mongodb";
import { MigrationInterface } from "mongo-migrate-ts";

export class Migration1654803415373 implements MigrationInterface {
  public async up(db: Db): Promise<any> {}

  public async down(db: Db): Promise<any> {}
}
