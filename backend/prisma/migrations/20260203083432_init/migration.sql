-- CreateTable
CREATE TABLE "Post" (
    "id" SERIAL NOT NULL,
    "externalId" INTEGER NOT NULL,
    "postId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);
