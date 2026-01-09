-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isPublished" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "_CategoryAccess" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CategoryAccess_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CategoryAccess_B_index" ON "_CategoryAccess"("B");

-- AddForeignKey
ALTER TABLE "_CategoryAccess" ADD CONSTRAINT "_CategoryAccess_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryAccess" ADD CONSTRAINT "_CategoryAccess_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
