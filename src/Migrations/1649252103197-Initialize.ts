import {MigrationInterface, QueryRunner} from "typeorm";

export class Initialize1649252103197 implements MigrationInterface {
    name = 'Initialize1649252103197'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`hashtag\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_347fec870eafea7b26c8a73bac\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`reply\` (\`id\` int NOT NULL AUTO_INCREMENT, \`text\` text NOT NULL, \`commentId\` int NULL, \`authorUsername\` varchar(255) NULL, \`toUsername\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user\` (\`username\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`avatar\` varchar(255) NOT NULL, \`profileBanner\` varchar(255) NOT NULL, \`isPrivate\` tinyint NOT NULL DEFAULT 0, \`postsId\` int NULL, \`commentsId\` int NULL, \`repliesId\` int NULL, \`repliesForId\` int NULL, PRIMARY KEY (\`username\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`post\` (\`id\` int NOT NULL AUTO_INCREMENT, \`date\` datetime NOT NULL, \`dateUpdated\` datetime NULL, \`text\` text NOT NULL, \`images\` json NOT NULL, \`authorUsername\` varchar(255) NULL, \`commentsId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`comment\` (\`id\` int NOT NULL AUTO_INCREMENT, \`text\` text NOT NULL, \`authorUsername\` varchar(255) NULL, \`postId\` int NULL, \`repliesId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`reply_likes_user\` (\`replyId\` int NOT NULL, \`userUsername\` varchar(255) NOT NULL, INDEX \`IDX_3e4c4dbf618ed7a1b242c8552a\` (\`replyId\`), INDEX \`IDX_badbdd40121287dee975c6748b\` (\`userUsername\`), PRIMARY KEY (\`replyId\`, \`userUsername\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_subscribers_user\` (\`userUsername_1\` varchar(255) NOT NULL, \`userUsername_2\` varchar(255) NOT NULL, INDEX \`IDX_d8510ca99c53c6585e2da8b25f\` (\`userUsername_1\`), INDEX \`IDX_a1cf77f59b566bb2e2533f7097\` (\`userUsername_2\`), PRIMARY KEY (\`userUsername_1\`, \`userUsername_2\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`post_hashtags_hashtag\` (\`postId\` int NOT NULL, \`hashtagId\` int NOT NULL, INDEX \`IDX_8208b8abf539c8abf342824a34\` (\`postId\`), INDEX \`IDX_5d6c565b7ea325e2677138c34a\` (\`hashtagId\`), PRIMARY KEY (\`postId\`, \`hashtagId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`post_marked_users_user\` (\`postId\` int NOT NULL, \`userUsername\` varchar(255) NOT NULL, INDEX \`IDX_e064b9bd61b7fd2f3c6e924de1\` (\`postId\`), INDEX \`IDX_a554af1115f0ffe350cb5a28f9\` (\`userUsername\`), PRIMARY KEY (\`postId\`, \`userUsername\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`post_likes_user\` (\`postId\` int NOT NULL, \`userUsername\` varchar(255) NOT NULL, INDEX \`IDX_631290356ede4fcbb402128732\` (\`postId\`), INDEX \`IDX_369dfe3d001b171833a42a1b22\` (\`userUsername\`), PRIMARY KEY (\`postId\`, \`userUsername\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`comment_likes_user\` (\`commentId\` int NOT NULL, \`userUsername\` varchar(255) NOT NULL, INDEX \`IDX_b1a1ce2a2776e6850b73de0537\` (\`commentId\`), INDEX \`IDX_299ecabcbc76fdd3979700e1ff\` (\`userUsername\`), PRIMARY KEY (\`commentId\`, \`userUsername\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`reply\` ADD CONSTRAINT \`FK_b63950f2876403407137a257a9a\` FOREIGN KEY (\`commentId\`) REFERENCES \`comment\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`reply\` ADD CONSTRAINT \`FK_3d73120335840873eee5aa85b13\` FOREIGN KEY (\`authorUsername\`) REFERENCES \`user\`(\`username\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`reply\` ADD CONSTRAINT \`FK_71a01c8f04b30ac6e8239ddd70c\` FOREIGN KEY (\`toUsername\`) REFERENCES \`user\`(\`username\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD CONSTRAINT \`FK_8a6cdd56be8ef9b327f2d154dfc\` FOREIGN KEY (\`postsId\`) REFERENCES \`post\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD CONSTRAINT \`FK_bd84d3585680cde8c2c3cc0788f\` FOREIGN KEY (\`commentsId\`) REFERENCES \`comment\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD CONSTRAINT \`FK_d675e19f7fbc89bd87932abaab1\` FOREIGN KEY (\`repliesId\`) REFERENCES \`reply\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD CONSTRAINT \`FK_4e50251111dcf326e4da3914381\` FOREIGN KEY (\`repliesForId\`) REFERENCES \`reply\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`post\` ADD CONSTRAINT \`FK_f3176d139ba182acb9f34f71262\` FOREIGN KEY (\`authorUsername\`) REFERENCES \`user\`(\`username\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`post\` ADD CONSTRAINT \`FK_042b9825d770d6b3009ae206c2f\` FOREIGN KEY (\`commentsId\`) REFERENCES \`comment\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`comment\` ADD CONSTRAINT \`FK_952818a2adfe03e2b48972eff96\` FOREIGN KEY (\`authorUsername\`) REFERENCES \`user\`(\`username\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`comment\` ADD CONSTRAINT \`FK_94a85bb16d24033a2afdd5df060\` FOREIGN KEY (\`postId\`) REFERENCES \`post\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`comment\` ADD CONSTRAINT \`FK_1ae5b39256bb761f6735bb0a1c1\` FOREIGN KEY (\`repliesId\`) REFERENCES \`reply\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`reply_likes_user\` ADD CONSTRAINT \`FK_3e4c4dbf618ed7a1b242c8552af\` FOREIGN KEY (\`replyId\`) REFERENCES \`reply\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`reply_likes_user\` ADD CONSTRAINT \`FK_badbdd40121287dee975c6748be\` FOREIGN KEY (\`userUsername\`) REFERENCES \`user\`(\`username\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_subscribers_user\` ADD CONSTRAINT \`FK_d8510ca99c53c6585e2da8b25f3\` FOREIGN KEY (\`userUsername_1\`) REFERENCES \`user\`(\`username\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`user_subscribers_user\` ADD CONSTRAINT \`FK_a1cf77f59b566bb2e2533f7097d\` FOREIGN KEY (\`userUsername_2\`) REFERENCES \`user\`(\`username\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`post_hashtags_hashtag\` ADD CONSTRAINT \`FK_8208b8abf539c8abf342824a34a\` FOREIGN KEY (\`postId\`) REFERENCES \`post\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`post_hashtags_hashtag\` ADD CONSTRAINT \`FK_5d6c565b7ea325e2677138c34ae\` FOREIGN KEY (\`hashtagId\`) REFERENCES \`hashtag\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`post_marked_users_user\` ADD CONSTRAINT \`FK_e064b9bd61b7fd2f3c6e924de14\` FOREIGN KEY (\`postId\`) REFERENCES \`post\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`post_marked_users_user\` ADD CONSTRAINT \`FK_a554af1115f0ffe350cb5a28f96\` FOREIGN KEY (\`userUsername\`) REFERENCES \`user\`(\`username\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`post_likes_user\` ADD CONSTRAINT \`FK_631290356ede4fcbb4021287321\` FOREIGN KEY (\`postId\`) REFERENCES \`post\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`post_likes_user\` ADD CONSTRAINT \`FK_369dfe3d001b171833a42a1b22f\` FOREIGN KEY (\`userUsername\`) REFERENCES \`user\`(\`username\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`comment_likes_user\` ADD CONSTRAINT \`FK_b1a1ce2a2776e6850b73de0537c\` FOREIGN KEY (\`commentId\`) REFERENCES \`comment\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`comment_likes_user\` ADD CONSTRAINT \`FK_299ecabcbc76fdd3979700e1ff1\` FOREIGN KEY (\`userUsername\`) REFERENCES \`user\`(\`username\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`comment_likes_user\` DROP FOREIGN KEY \`FK_299ecabcbc76fdd3979700e1ff1\``);
        await queryRunner.query(`ALTER TABLE \`comment_likes_user\` DROP FOREIGN KEY \`FK_b1a1ce2a2776e6850b73de0537c\``);
        await queryRunner.query(`ALTER TABLE \`post_likes_user\` DROP FOREIGN KEY \`FK_369dfe3d001b171833a42a1b22f\``);
        await queryRunner.query(`ALTER TABLE \`post_likes_user\` DROP FOREIGN KEY \`FK_631290356ede4fcbb4021287321\``);
        await queryRunner.query(`ALTER TABLE \`post_marked_users_user\` DROP FOREIGN KEY \`FK_a554af1115f0ffe350cb5a28f96\``);
        await queryRunner.query(`ALTER TABLE \`post_marked_users_user\` DROP FOREIGN KEY \`FK_e064b9bd61b7fd2f3c6e924de14\``);
        await queryRunner.query(`ALTER TABLE \`post_hashtags_hashtag\` DROP FOREIGN KEY \`FK_5d6c565b7ea325e2677138c34ae\``);
        await queryRunner.query(`ALTER TABLE \`post_hashtags_hashtag\` DROP FOREIGN KEY \`FK_8208b8abf539c8abf342824a34a\``);
        await queryRunner.query(`ALTER TABLE \`user_subscribers_user\` DROP FOREIGN KEY \`FK_a1cf77f59b566bb2e2533f7097d\``);
        await queryRunner.query(`ALTER TABLE \`user_subscribers_user\` DROP FOREIGN KEY \`FK_d8510ca99c53c6585e2da8b25f3\``);
        await queryRunner.query(`ALTER TABLE \`reply_likes_user\` DROP FOREIGN KEY \`FK_badbdd40121287dee975c6748be\``);
        await queryRunner.query(`ALTER TABLE \`reply_likes_user\` DROP FOREIGN KEY \`FK_3e4c4dbf618ed7a1b242c8552af\``);
        await queryRunner.query(`ALTER TABLE \`comment\` DROP FOREIGN KEY \`FK_1ae5b39256bb761f6735bb0a1c1\``);
        await queryRunner.query(`ALTER TABLE \`comment\` DROP FOREIGN KEY \`FK_94a85bb16d24033a2afdd5df060\``);
        await queryRunner.query(`ALTER TABLE \`comment\` DROP FOREIGN KEY \`FK_952818a2adfe03e2b48972eff96\``);
        await queryRunner.query(`ALTER TABLE \`post\` DROP FOREIGN KEY \`FK_042b9825d770d6b3009ae206c2f\``);
        await queryRunner.query(`ALTER TABLE \`post\` DROP FOREIGN KEY \`FK_f3176d139ba182acb9f34f71262\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_4e50251111dcf326e4da3914381\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_d675e19f7fbc89bd87932abaab1\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_bd84d3585680cde8c2c3cc0788f\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_8a6cdd56be8ef9b327f2d154dfc\``);
        await queryRunner.query(`ALTER TABLE \`reply\` DROP FOREIGN KEY \`FK_71a01c8f04b30ac6e8239ddd70c\``);
        await queryRunner.query(`ALTER TABLE \`reply\` DROP FOREIGN KEY \`FK_3d73120335840873eee5aa85b13\``);
        await queryRunner.query(`ALTER TABLE \`reply\` DROP FOREIGN KEY \`FK_b63950f2876403407137a257a9a\``);
        await queryRunner.query(`DROP INDEX \`IDX_299ecabcbc76fdd3979700e1ff\` ON \`comment_likes_user\``);
        await queryRunner.query(`DROP INDEX \`IDX_b1a1ce2a2776e6850b73de0537\` ON \`comment_likes_user\``);
        await queryRunner.query(`DROP TABLE \`comment_likes_user\``);
        await queryRunner.query(`DROP INDEX \`IDX_369dfe3d001b171833a42a1b22\` ON \`post_likes_user\``);
        await queryRunner.query(`DROP INDEX \`IDX_631290356ede4fcbb402128732\` ON \`post_likes_user\``);
        await queryRunner.query(`DROP TABLE \`post_likes_user\``);
        await queryRunner.query(`DROP INDEX \`IDX_a554af1115f0ffe350cb5a28f9\` ON \`post_marked_users_user\``);
        await queryRunner.query(`DROP INDEX \`IDX_e064b9bd61b7fd2f3c6e924de1\` ON \`post_marked_users_user\``);
        await queryRunner.query(`DROP TABLE \`post_marked_users_user\``);
        await queryRunner.query(`DROP INDEX \`IDX_5d6c565b7ea325e2677138c34a\` ON \`post_hashtags_hashtag\``);
        await queryRunner.query(`DROP INDEX \`IDX_8208b8abf539c8abf342824a34\` ON \`post_hashtags_hashtag\``);
        await queryRunner.query(`DROP TABLE \`post_hashtags_hashtag\``);
        await queryRunner.query(`DROP INDEX \`IDX_a1cf77f59b566bb2e2533f7097\` ON \`user_subscribers_user\``);
        await queryRunner.query(`DROP INDEX \`IDX_d8510ca99c53c6585e2da8b25f\` ON \`user_subscribers_user\``);
        await queryRunner.query(`DROP TABLE \`user_subscribers_user\``);
        await queryRunner.query(`DROP INDEX \`IDX_badbdd40121287dee975c6748b\` ON \`reply_likes_user\``);
        await queryRunner.query(`DROP INDEX \`IDX_3e4c4dbf618ed7a1b242c8552a\` ON \`reply_likes_user\``);
        await queryRunner.query(`DROP TABLE \`reply_likes_user\``);
        await queryRunner.query(`DROP TABLE \`comment\``);
        await queryRunner.query(`DROP TABLE \`post\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP TABLE \`reply\``);
        await queryRunner.query(`DROP INDEX \`IDX_347fec870eafea7b26c8a73bac\` ON \`hashtag\``);
        await queryRunner.query(`DROP TABLE \`hashtag\``);
    }

}
