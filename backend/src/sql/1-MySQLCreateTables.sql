-- ----------------------------------------------------------------------------
-- This file stands for creating the tables in DataBase that are going to be
-- used in the application.
-------------------------------------------------------------------------------

-- First of all, we drop all tables to make sure we have an empty DB.
DROP TABLE UserReport;
DROP TABLE ImageReport;
DROP TABLE RewardClaimed;
DROP TABLE Reward;
DROP TABLE PointsRegister;
DROP TABLE TagLike;
DROP TABLE Comment;
DROP TABLE Tag;
DROP TABLE ImageLike;
DROP TABLE ImageSeenInFeed;
DROP TABLE Image;
DROP TABLE FollowRequest;
DROP TABLE Follow;
DROP TABLE VerificationRequest;
DROP TABLE UserPenalty;
DROP TABLE UserPoints;
DROP TABLE UserSettings;
DROP TABLE User;

-- Creating table User to store users of all types.
CREATE TABLE User (

    id BIGINT NOT NULL AUTO_INCREMENT,
    userName VARCHAR(60) COLLATE latin1_bin NOT NULL,
    password VARCHAR(60) NOT NULL,
    silenced BOOLEAN NOT NULL,
    blocked BOOLEAN NOT NULL,
    name VARCHAR(60),
    surname VARCHAR(60),
    about VARCHAR(120),
    email VARCHAR(60),
    birthDate DATE,
    phoneNumber VARCHAR(60),
    profilePicture LONGBLOB,
    verified BOOLEAN,
    role TINYINT NOT NULL,
    verificationCode VARCHAR(30),

    CONSTRAINT UserPK PRIMARY KEY (id),
    CONSTRAINT UserNameUniqueKey UNIQUE (userName)

) ENGINE = InnoDB;

-- Creating table UserSettings to store the preferences of the User.
CREATE TABLE UserSettings (

    id BIGINT NOT NULL AUTO_INCREMENT,
    privacyPublic BOOLEAN NOT NULL,
    notifyMe BOOLEAN NOT NULL,
    showUplRewardHelp BOOLEAN NOT NULL,
    showUplImageHelp BOOLEAN NOT NULL,
    userId BIGINT NOT NULL,

    CONSTRAINT UserSettingsPK PRIMARY KEY (id),
    CONSTRAINT UserSettingsUserIdFK FOREIGN KEY (userId)
        REFERENCES User(id)

) ENGINE = InnoDb;

-- Creating table UserPoints to store the points obtained by a user, publication time
-- and if he has published today.
CREATE TABLE UserPoints (

    id BIGINT NOT NULL AUTO_INCREMENT,
    points BIGINT NOT NULL,
    publicationTime DATETIME NOT NULL,
    publishedToday BOOLEAN NOT NULL,
    userId BIGINT NOT NULL,

    CONSTRAINT UserPointsPK PRIMARY KEY (id),
    CONSTRAINT UserPointsUserIdFK FOREIGN KEY (userId)
        REFERENCES User(id)

) ENGINE = InnoDb;

-- Creating table UserPenalty to store all penalty related from users
CREATE TABLE UserPenalty (

    id BIGINT NOT NULL AUTO_INCREMENT,
    silencedUntil DATETIME,
    blockedUntil DATETIME,
    userId BIGINT NOT NULL,

    CONSTRAINT UserPenaltyPK PRIMARY KEY (id),
    CONSTRAINT UserPenaltyUserIdFK FOREIGN KEY (userId)
        REFERENCES User(id)

) ENGINE = InnoDb;

-- Creating table VerificationRequest to store requests from brands to get verified
CREATE TABLE VerificationRequest (

    id BIGINT NOT NULL AUTO_INCREMENT,
    date DATETIME NOT NULL,
    brandId BIGINT NOT NULL,

    CONSTRAINT VerificationRequestPK PRIMARY KEY (id),
    CONSTRAINT VerificationRequestBrandId FOREIGN KEY (brandId)
        REFERENCES User(id)

) ENGINE = InnoDb;

-- Creating table FollowRequest to store requests from users to follow other users
CREATE TABLE FollowRequest (

    id BIGINT NOT NULL AUTO_INCREMENT,
    userId BIGINT NOT NULL,
    userToFollowId BIGINT NOT NULL,

    CONSTRAINT FollowRequestPK PRIMARY KEY (id),
    CONSTRAINT FollowRequestUserId FOREIGN KEY (userId)
        REFERENCES User(id),
    CONSTRAINT FollowRequestUserToFollowId FOREIGN KEY (userToFollowId)
        REFERENCES User(id)

) ENGINE = InnoDb;

-- Creating table Follow to store when a user follows another user.
CREATE TABLE Follow (

    id BIGINT NOT NULL AUTO_INCREMENT,
    since DATETIME NOT NULL,
    userId BIGINT NOT NULL,
    followsUserId BIGINT NOT NULL,

    CONSTRAINT FollowPK PRIMARY KEY (id),
    CONSTRAINT FollowUserId FOREIGN KEY (userId)
        REFERENCES User(id),
    CONSTRAINT FollowFollowsUserId FOREIGN KEY (followsUserId)
        REFERENCES User(id)

) ENGINE = InnoDb;

-- Creating table Category to store the info from the categories that
-- tags can be introduced.
CREATE TABLE IF NOT EXISTS Category (

    id BIGINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(60) NOT NULL,
    active BOOLEAN NOT NULL,

    CONSTRAINT CategoryPK PRIMARY KEY (id)

) ENGINE = InnoDb;

-- Creating Table Image to store the info about the images and the image file
CREATE TABLE Image (

    id BIGINT NOT NULL AUTO_INCREMENT,
    title VARCHAR(60) NOT NULL,
    description VARCHAR(120),
    location VARCHAR(60),
    imgFile LONGBLOB,
    date DATETIME NOT NULL,
    hidden BOOLEAN NOT NULL,
    userId BIGINT NOT NULL,

    CONSTRAINT ImagePK PRIMARY KEY (id),
    CONSTRAINT ImageUserIdFK FOREIGN KEY (userId)
        REFERENCES User(id)

) ENGINE = InnoDb;

-- Creating table ImageSeenInFeed to store when an user sees an image in his feed.
CREATE TABLE ImageSeenInFeed (

    id BIGINT NOT NULL AUTO_INCREMENT,
    userId BIGINT NOT NULL,
    imageId BIGINT NOT NULL,

    CONSTRAINT ImageSeenInFeedPK PRIMARY KEY (id),
    CONSTRAINT ImageSeenInFeedUserIdFK FOREIGN KEY (userId)
        REFERENCES User(id),
    CONSTRAINT ImageSeenInFeedImageIdFK FOREIGN KEY (imageId)
        REFERENCES Image(id) ON DELETE CASCADE

) ENGINE = InnoDb;

-- Creating table ImageLike to store likes from users to an Image.
CREATE TABLE ImageLike (

    id BIGINT NOT NULL AUTO_INCREMENT,
    date DATETIME NOT NULL,
    userId BIGINT NOT NULL,
    imageId BIGINT NOT NULL,

    CONSTRAINT ImageLikePK PRIMARY KEY (id),
    CONSTRAINT ImageLikeUserIdFK FOREIGN KEY (userId)
        REFERENCES User(id),
    CONSTRAINT ImageLikeImageIdFK FOREIGN KEY (imageId)
        REFERENCES Image(id) ON DELETE CASCADE

) ENGINE = InnoDb;

-- Creating table Comment to store comments from users to an Image.
CREATE TABLE Comment (

    id BIGINT NOT NULL AUTO_INCREMENT,
    text VARCHAR(100) NOT NULL,
    date DATETIME NOT NULL,
    userId BIGINT NOT NULL,
    imageId BIGINT NOT NULL,
    numAnswers BIGINT NOT NULL,
    commentAnsweredId BIGINT,

    CONSTRAINT CommentPK PRIMARY KEY (id),
    CONSTRAINT CommentUserIdFK FOREIGN KEY (userId)
        REFERENCES User(id),
    CONSTRAINT CommentImageIdFK FOREIGN KEY (imageId)
        REFERENCES Image(id) ON DELETE CASCADE,
    CONSTRAINT CommentCommentAnsweredIdFK FOREIGN KEY (commentAnsweredId)
        REFERENCES Comment(id) ON DELETE CASCADE

) ENGINE = InnoDb;

-- Creating Table Tag to store info about the tags associated to an Image
CREATE TABLE Tag (

    id BIGINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(60) NOT NULL,
    link VARCHAR(600),
    coordinateX INT NOT NULL,
    coordinateY INT NOT NULL,
    categoryId BIGINT NOT NULL,
    imageId BIGINT NOT NULL,
    brandId BIGINT,

    CONSTRAINT TagPK PRIMARY KEY (id),
    CONSTRAINT TagCategoryIdFK FOREIGN KEY (categoryId)
        REFERENCES Category(id),
    CONSTRAINT TagImageIdFK FOREIGN KEY (imageId)
        REFERENCES Image(id) ON DELETE CASCADE,
    CONSTRAINT TagBrandIdFK FOREIGN KEY (brandId)
        REFERENCES User(id)

) ENGINE = InnoDb;

-- Creating table TagLike to store likes to determinate tags
CREATE TABLE TagLike (

    id BIGINT NOT NULL AUTO_INCREMENT,
    date DATETIME NOT NULL,
    userId BIGINT NOT NULL,
    tagId BIGINT NOT NULL,

    CONSTRAINT TagLikePK PRIMARY KEY (id),
    CONSTRAINT TagLikeUserIdFK FOREIGN KEY (userId)
        REFERENCES User(id),
    CONSTRAINT TagLikeTagIdFK FOREIGN KEY (tagId)
        REFERENCES Tag(id) ON DELETE CASCADE

) ENGINE = InnoDb;

-- Creating table PointsRegister to register points given to users and its activity.
CREATE TABLE PointsRegister (

    id BIGINT NOT NULL AUTO_INCREMENT,
    pointsGiven BIGINT NOT NULL,
    date DATETIME NOT NULL,
    userId BIGINT NOT NULL,
    followId BIGINT,
    imgLikeId BIGINT,
    tagLikeId BIGINT,
    commentId BIGINT,

    CONSTRAINT PointsRegisterPK PRIMARY KEY (id),
    CONSTRAINT PointsRegisterUserIdFK FOREIGN KEY (userId)
        REFERENCES User(id),
    CONSTRAINT PointsRegisterFollowIdFK FOREIGN KEY (followId)
        REFERENCES Follow(id) ON DELETE SET NULL,
    CONSTRAINT PointsRegisterImgLikeIdFK FOREIGN KEY (imgLikeId)
        REFERENCES ImageLike(id) ON DELETE SET NULL,
    CONSTRAINT PointsRegisterTagLikeIdFK FOREIGN KEY (tagLikeId)
        REFERENCES TagLike(id) ON DELETE SET NULL,
    CONSTRAINT PointsRegisterCommentIdFK FOREIGN KEY (commentId)
        REFERENCES Comment(id) ON DELETE SET NULL

) ENGINE = InnoDb;

-- Creating table Reward to store rewards created by brand users.
CREATE TABLE Reward (

    id BIGINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(60) NOT NULL,
    description VARCHAR(60) NOT NULL,
    creationDate DATETIME NOT NULL,
    endDate DATETIME NOT NULL,
    pointsCost BIGINT NOT NULL,
    publicationsNeeded BIGINT,
    stock BIGINT NOT NULL,
    imgFile LONGBLOB NOT NULL,
    hidden BOOLEAN NOT NULL,
    brandId BIGINT NOT NULL,

    CONSTRAINT RewardPK PRIMARY KEY (id),
    CONSTRAINT RewardBrandId FOREIGN KEY (brandId)
        REFERENCES User(id)

) ENGINE = InnoDb;

-- Creating table RewardClaimed to store when a user claims a reward.
CREATE TABLE RewardClaimed (

    id BIGINT NOT NULL AUTO_INCREMENT,
    userId BIGINT NOT NULL,
    rewardId BIGINT NOT NULL,

    CONSTRAINT RewardClaimedPK PRIMARY KEY (id),
    CONSTRAINT RewardClaimedUserIdFK FOREIGN KEY (userId)
        REFERENCES User(id),
    CONSTRAINT RewardClaimedRewardIdFK FOREIGN KEY (rewardId)
        REFERENCES Reward(id)

) ENGINE = InnoDb;

-- Creating table UserReport to store a report from a user to another user.
CREATE TABLE UserReport (

    id BIGINT NOT NULL AUTO_INCREMENT,
    reason TINYINT NOT NULL,
    explanation VARCHAR(120) NOT NULL,
    resolved BOOLEAN NOT NULL,
    date DATETIME NOT NULL,
    userId BIGINT NOT NULL,
    userReportedId BIGINT NOT NULL,

    CONSTRAINT UserReportPK PRIMARY KEY (id),
    CONSTRAINT UserReportUserIdFK FOREIGN KEY (userId)
        REFERENCES User(id),
    CONSTRAINT UserReportUserReportedIdFK FOREIGN KEY (userReportedId)
        REFERENCES User(id)

) ENGINE = InnoDb;

-- Creating table ImageReport to store a report from a user to another user image.
CREATE TABLE ImageReport (

    id BIGINT NOT NULL AUTO_INCREMENT,
    reason TINYINT NOT NULL,
    explanation VARCHAR(120) NOT NULL,
    resolved BOOLEAN NOT NULL,
    date DATETIME NOT NULL,
    userId BIGINT NOT NULL,
    imageReportedId BIGINT NOT NULL,

    CONSTRAINT ImageReportPK PRIMARY KEY (id),
    CONSTRAINT ImageReportUserIdFK FOREIGN KEY (userId)
        REFERENCES User(id),
    CONSTRAINT ImageReportImageReportedIdFK FOREIGN KEY (imageReportedId)
        REFERENCES Image(id)

) ENGINE = InnoDb;