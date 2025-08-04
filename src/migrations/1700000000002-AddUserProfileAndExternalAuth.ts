import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserProfileAndExternalAuth1700000000002
  implements MigrationInterface
{
  name = 'AddUserProfileAndExternalAuth1700000000002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add profile picture URL column
    await queryRunner.query(
      `ALTER TABLE "user" ADD "profilePictureUrl" character varying`,
    );

    // Add external account ID column
    await queryRunner.query(
      `ALTER TABLE "user" ADD "externalAccountId" character varying`,
    );

    // Add external provider enum column
    await queryRunner.query(
      `CREATE TYPE "public"."user_externalprovider_enum" AS ENUM('toku', 'google', 'facebook', 'github')`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "externalProvider" "public"."user_externalprovider_enum"`,
    );

    // Make password hash nullable for external auth users
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "passwordHash" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert password hash to not null
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "passwordHash" SET NOT NULL`,
    );

    // Drop external provider enum column
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "externalProvider"`,
    );
    await queryRunner.query(`DROP TYPE "public"."user_externalprovider_enum"`);

    // Drop external account ID column
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "externalAccountId"`,
    );

    // Drop profile picture URL column
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "profilePictureUrl"`,
    );
  }
}
