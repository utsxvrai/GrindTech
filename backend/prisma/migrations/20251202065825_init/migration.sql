-- CreateTable
CREATE TABLE "User" (
    "uuid" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "useremail" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "plan" TEXT NOT NULL DEFAULT 'free',
    "questionsContributed" INTEGER NOT NULL DEFAULT 0,
    "levelsDone" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "Topic" (
    "topicId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "techId" TEXT NOT NULL,

    CONSTRAINT "Topic_pkey" PRIMARY KEY ("topicId")
);

-- CreateTable
CREATE TABLE "Tech" (
    "techId" TEXT NOT NULL,
    "techName" TEXT NOT NULL,

    CONSTRAINT "Tech_pkey" PRIMARY KEY ("techId")
);

-- CreateTable
CREATE TABLE "Resource" (
    "rid" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,

    CONSTRAINT "Resource_pkey" PRIMARY KEY ("rid")
);

-- CreateTable
CREATE TABLE "Question" (
    "qid" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("qid")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_useremail_key" ON "User"("useremail");

-- AddForeignKey
ALTER TABLE "Topic" ADD CONSTRAINT "Topic_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Topic" ADD CONSTRAINT "Topic_techId_fkey" FOREIGN KEY ("techId") REFERENCES "Tech"("techId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resource" ADD CONSTRAINT "Resource_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("topicId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("topicId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
