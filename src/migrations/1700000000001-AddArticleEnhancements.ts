import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddArticleEnhancements1700000000001 implements MigrationInterface {
  name = 'AddArticleEnhancements1700000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "article" 
      ADD COLUMN "summary" text,
      ADD COLUMN "country" character varying,
      ADD COLUMN "city" character varying,
      ADD COLUMN "tags" text[],
      ADD COLUMN "images" text[],
      ADD COLUMN "travelDate" date,
      ADD COLUMN "duration" integer,
      ADD COLUMN "isPublished" boolean NOT NULL DEFAULT false
    `);

    // Create indexes for better performance
    await queryRunner.query(`
      CREATE INDEX "IDX_article_country_city" ON "article" ("country", "city")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_article_isPublished_createdAt" ON "article" ("isPublished", "createdAt")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_article_travelDate" ON "article" ("travelDate")
    `);

    // Create GIN index for tags array search
    await queryRunner.query(`
      CREATE INDEX "IDX_article_tags" ON "article" USING GIN ("tags")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.query(`DROP INDEX "IDX_article_tags"`);
    await queryRunner.query(`DROP INDEX "IDX_article_travelDate"`);
    await queryRunner.query(`DROP INDEX "IDX_article_isPublished_createdAt"`);
    await queryRunner.query(`DROP INDEX "IDX_article_country_city"`);

    // Drop columns
    await queryRunner.query(`
      ALTER TABLE "article" 
      DROP COLUMN "isPublished",
      DROP COLUMN "duration",
      DROP COLUMN "travelDate",
      DROP COLUMN "images",
      DROP COLUMN "tags",
      DROP COLUMN "city",
      DROP COLUMN "country",
      DROP COLUMN "summary"
    `);
  }
}
