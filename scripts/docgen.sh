# Generates documentation using JSDoc comments
jsdoc2md ../src/background/index.js > ../doc/background/index.md;
jsdoc2md ../src/background/archiveCreate.js > ../doc/background/archiveCreate.md;
jsdoc2md ../src/background/archiveDelete.js > ../doc/background/archiveDelete.md;
jsdoc2md ../src/background/archivePullTimeline.js > ../doc/background/archivePullTimeline.md;
jsdoc2md ../src/background/archiveTogglePrivacyStatus.js > ../doc/background/archiveTogglePrivacyStatus.md;
jsdoc2md ../src/background/authCheck.js > ../doc/background/authCheck.md;
jsdoc2md ../src/background/authSignIn.js > ../doc/background/authSignIn.md;
jsdoc2md ../src/background/authSignOut.js > ../doc/background/authSignOut.md;
jsdoc2md ../src/background/foldersPick.js > ../doc/background/foldersPick.md;
jsdoc2md ../src/background/foldersPullList.js > ../doc/background/foldersPullList.md;
jsdoc2md ../src/background/statusCleanUp.js > ../doc/background/statusCleanUp.md;
jsdoc2md ../src/background/tabSwitch.js > ../doc/background/tabSwitch.md;

jsdoc2md ../src/constants/index.js > ../doc/constants/index.md;

jsdoc2md ../src/storage/index.js > ../doc/storage/index.md;
jsdoc2md ../src/storage/Archives.js > ../doc/storage/Archives.md;
jsdoc2md ../src/storage/Auth.js > ../doc/storage/Auth.md;
jsdoc2md ../src/storage/CurrentTab.js > ../doc/storage/CurrentTab.md;
jsdoc2md ../src/storage/Folders.js > ../doc/storage/Folders.md;
jsdoc2md ../src/storage/Status.js > ../doc/storage/Status.md;

jsdoc2md ../src/popup/index.js > ../doc/popup/index.md;
jsdoc2md ../src/popup/handlers/onPopupOpen.js > ../doc/popup/handlers/onPopupOpen.md;
jsdoc2md ../src/popup/handlers/onStorageUpdate.js > ../doc/popup/handlers/onStorageUpdate.md;
jsdoc2md ../src/popup/components/AppHeader.js > ../doc/popup/components/AppHeader.md;
jsdoc2md ../src/popup/components/ArchiveForm.js > ../doc/popup/components/ArchiveForm.md;
jsdoc2md ../src/popup/components/ArchiveTimeline.js > ../doc/popup/components/ArchiveTimeline.md;
jsdoc2md ../src/popup/components/ArchiveTimelineItem.js > ../doc/popup/components/ArchiveTimelineItem.md;
jsdoc2md ../src/popup/components/StatusBar.js > ../doc/popup/components/StatusBar.md;
