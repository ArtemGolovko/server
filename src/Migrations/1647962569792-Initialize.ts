import {MigrationInterface, QueryRunner} from "typeorm";

export class Initialize1647962569792 implements MigrationInterface {
    name = 'Initialize1647962569792'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`post\` (\`id\` int NOT NULL AUTO_INCREMENT, \`date\` datetime NOT NULL, \`text\` text NOT NULL, \`hastags\` json NOT NULL, \`images\` json NOT NULL, \`authorUsername\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_subscribers_user\` (\`userUsername_1\` varchar(255) NOT NULL, \`userUsername_2\` varchar(255) NOT NULL, INDEX \`IDX_d8510ca99c53c6585e2da8b25f\` (\`userUsername_1\`), INDEX \`IDX_a1cf77f59b566bb2e2533f7097\` (\`userUsername_2\`), PRIMARY KEY (\`userUsername_1\`, \`userUsername_2\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`post_likes_user\` (\`postId\` int NOT NULL, \`userUsername\` varchar(255) NOT NULL, INDEX \`IDX_631290356ede4fcbb402128732\` (\`postId\`), INDEX \`IDX_369dfe3d001b171833a42a1b22\` (\`userUsername\`), PRIMARY KEY (\`postId\`, \`userUsername\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD CONSTRAINT \`FK_8a6cdd56be8ef9b327f2d154dfc\` FOREIGN KEY (\`postsId\`) REFERENCES \`post\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`post\` ADD CONSTRAINT \`FK_f3176d139ba182acb9f34f71262\` FOREIGN KEY (\`authorUsername\`) REFERENCES \`user\`(\`username\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_subscribers_user\` ADD CONSTRAINT \`FK_d8510ca99c53c6585e2da8b25f3\` FOREIGN KEY (\`userUsername_1\`) REFERENCES \`user\`(\`username\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`user_subscribers_user\` ADD CONSTRAINT \`FK_a1cf77f59b566bb2e2533f7097d\` FOREIGN KEY (\`userUsername_2\`) REFERENCES \`user\`(\`username\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`post_likes_user\` ADD CONSTRAINT \`FK_631290356ede4fcbb4021287321\` FOREIGN KEY (\`postId\`) REFERENCES \`post\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`post_likes_user\` ADD CONSTRAINT \`FK_369dfe3d001b171833a42a1b22f\` FOREIGN KEY (\`userUsername\`) REFERENCES \`user\`(\`username\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`post_likes_user\` DROP FOREIGN KEY \`FK_369dfe3d001b171833a42a1b22f\``);
        await queryRunner.query(`ALTER TABLE \`post_likes_user\` DROP FOREIGN KEY \`FK_631290356ede4fcbb4021287321\``);
        await queryRunner.query(`ALTER TABLE \`user_subscribers_user\` DROP FOREIGN KEY \`FK_a1cf77f59b566bb2e2533f7097d\``);
        await queryRunner.query(`ALTER TABLE \`user_subscribers_user\` DROP FOREIGN KEY \`FK_d8510ca99c53c6585e2da8b25f3\``);
        await queryRunner.query(`ALTER TABLE \`post\` DROP FOREIGN KEY \`FK_f3176d139ba182acb9f34f71262\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_8a6cdd56be8ef9b327f2d154dfc\``);
        await queryRunner.query(`DROP INDEX \`IDX_369dfe3d001b171833a42a1b22\` ON \`post_likes_user\``);
        await queryRunner.query(`DROP INDEX \`IDX_631290356ede4fcbb402128732\` ON \`post_likes_user\``);
        await queryRunner.query(`DROP TABLE \`post_likes_user\``);
        await queryRunner.query(`DROP INDEX \`IDX_a1cf77f59b566bb2e2533f7097\` ON \`user_subscribers_user\``);
        await queryRunner.query(`DROP INDEX \`IDX_d8510ca99c53c6585e2da8b25f\` ON \`user_subscribers_user\``);
        await queryRunner.query(`DROP TABLE \`user_subscribers_user\``);
        await queryRunner.query(`DROP TABLE \`post\``);
    }

}
