import {MigrationInterface, QueryRunner} from "typeorm";

export class AddHashtag1648289406557 implements MigrationInterface {
    name = 'AddHashtag1648289406557'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`hashtag\` (\`name\` varchar(255) NOT NULL, PRIMARY KEY (\`name\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`post_hashtags_hashtag\` (\`postId\` int NOT NULL, \`hashtagName\` varchar(255) NOT NULL, INDEX \`IDX_8208b8abf539c8abf342824a34\` (\`postId\`), INDEX \`IDX_79a315590a29bb023212859875\` (\`hashtagName\`), PRIMARY KEY (\`postId\`, \`hashtagName\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`post_marked_users_user\` (\`postId\` int NOT NULL, \`userUsername\` varchar(255) NOT NULL, INDEX \`IDX_e064b9bd61b7fd2f3c6e924de1\` (\`postId\`), INDEX \`IDX_a554af1115f0ffe350cb5a28f9\` (\`userUsername\`), PRIMARY KEY (\`postId\`, \`userUsername\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`post\` DROP COLUMN \`hastags\``);
        await queryRunner.query(`ALTER TABLE \`post_hashtags_hashtag\` ADD CONSTRAINT \`FK_8208b8abf539c8abf342824a34a\` FOREIGN KEY (\`postId\`) REFERENCES \`post\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`post_hashtags_hashtag\` ADD CONSTRAINT \`FK_79a315590a29bb0232128598755\` FOREIGN KEY (\`hashtagName\`) REFERENCES \`hashtag\`(\`name\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`post_marked_users_user\` ADD CONSTRAINT \`FK_e064b9bd61b7fd2f3c6e924de14\` FOREIGN KEY (\`postId\`) REFERENCES \`post\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`post_marked_users_user\` ADD CONSTRAINT \`FK_a554af1115f0ffe350cb5a28f96\` FOREIGN KEY (\`userUsername\`) REFERENCES \`user\`(\`username\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`post_marked_users_user\` DROP FOREIGN KEY \`FK_a554af1115f0ffe350cb5a28f96\``);
        await queryRunner.query(`ALTER TABLE \`post_marked_users_user\` DROP FOREIGN KEY \`FK_e064b9bd61b7fd2f3c6e924de14\``);
        await queryRunner.query(`ALTER TABLE \`post_hashtags_hashtag\` DROP FOREIGN KEY \`FK_79a315590a29bb0232128598755\``);
        await queryRunner.query(`ALTER TABLE \`post_hashtags_hashtag\` DROP FOREIGN KEY \`FK_8208b8abf539c8abf342824a34a\``);
        await queryRunner.query(`ALTER TABLE \`post\` ADD \`hastags\` json NOT NULL`);
        await queryRunner.query(`DROP INDEX \`IDX_a554af1115f0ffe350cb5a28f9\` ON \`post_marked_users_user\``);
        await queryRunner.query(`DROP INDEX \`IDX_e064b9bd61b7fd2f3c6e924de1\` ON \`post_marked_users_user\``);
        await queryRunner.query(`DROP TABLE \`post_marked_users_user\``);
        await queryRunner.query(`DROP INDEX \`IDX_79a315590a29bb023212859875\` ON \`post_hashtags_hashtag\``);
        await queryRunner.query(`DROP INDEX \`IDX_8208b8abf539c8abf342824a34\` ON \`post_hashtags_hashtag\``);
        await queryRunner.query(`DROP TABLE \`post_hashtags_hashtag\``);
        await queryRunner.query(`DROP TABLE \`hashtag\``);
    }

}
