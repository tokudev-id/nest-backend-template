import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInitialTables1700000000000 implements MigrationInterface {
  name = 'CreateInitialTables1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create users table
    await queryRunner.query(`
      CREATE TABLE "user" (
        "id" SERIAL PRIMARY KEY,
        "name" character varying NOT NULL,
        "email" character varying NOT NULL UNIQUE,
        "passwordHash" character varying NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
      )
    `);

    // Create articles table
    await queryRunner.query(`
      CREATE TABLE "article" (
        "id" SERIAL PRIMARY KEY,
        "title" character varying NOT NULL,
        "content" text NOT NULL,
        "authorId" integer NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "FK_article_author" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE CASCADE
      )
    `);

    // Create comments table
    await queryRunner.query(`
      CREATE TABLE "comment" (
        "id" SERIAL PRIMARY KEY,
        "content" text NOT NULL,
        "authorId" integer NOT NULL,
        "articleId" integer NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "FK_comment_author" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_comment_article" FOREIGN KEY ("articleId") REFERENCES "article"("id") ON DELETE CASCADE
      )
    `);

    // Create likes table
    await queryRunner.query(`
      CREATE TABLE "like" (
        "id" SERIAL PRIMARY KEY,
        "userId" integer NOT NULL,
        "articleId" integer NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "FK_like_user" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_like_article" FOREIGN KEY ("articleId") REFERENCES "article"("id") ON DELETE CASCADE,
        CONSTRAINT "UQ_like_user_article" UNIQUE ("userId", "articleId")
      )
    `);

    // Create indexes for better performance
    await queryRunner.query(`
      CREATE INDEX "IDX_user_email" ON "user" ("email")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_article_author" ON "article" ("authorId")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_article_created_at" ON "article" ("createdAt")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_comment_article" ON "comment" ("articleId")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_comment_author" ON "comment" ("authorId")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_comment_created_at" ON "comment" ("createdAt")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_like_user" ON "like" ("userId")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_like_article" ON "like" ("articleId")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_like_created_at" ON "like" ("createdAt")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.query(`DROP INDEX "IDX_like_created_at"`);
    await queryRunner.query(`DROP INDEX "IDX_like_article"`);
    await queryRunner.query(`DROP INDEX "IDX_like_user"`);
    await queryRunner.query(`DROP INDEX "IDX_comment_created_at"`);
    await queryRunner.query(`DROP INDEX "IDX_comment_author"`);
    await queryRunner.query(`DROP INDEX "IDX_comment_article"`);
    await queryRunner.query(`DROP INDEX "IDX_article_created_at"`);
    await queryRunner.query(`DROP INDEX "IDX_article_author"`);
    await queryRunner.query(`DROP INDEX "IDX_user_email"`);

    // Drop tables
    await queryRunner.query(`DROP TABLE "like"`);
    await queryRunner.query(`DROP TABLE "comment"`);
    await queryRunner.query(`DROP TABLE "article"`);
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
