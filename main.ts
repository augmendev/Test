interface UsersSheetRow extends SpreadsheetManagerTypes.GenericRowObject{
    gid: string;
    email: string;
    name: string;
}

function main(){
    const asana = new AsanaManager(config.asana);

    const users = asana.getAllUsers();

const ss = SpreadsheetApp.getActiveSpreadsheet();
const sheet = new SpreadsheetManager(ss, config.sheets.tutorial.tabs.users.name);
};

const rows:UsersSheetRow[] = users.data.map{(user) =>((
    gid:user.gid,
    email:user.email,
    name:user.name,
))};
