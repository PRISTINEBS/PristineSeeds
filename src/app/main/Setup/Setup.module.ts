import {NgModule} from '@angular/core';
import {RoleMasterModule} from "./RoleMaster/RoleMaster.module";
import {PickSetupModule} from "./PickSetup/PickSetup.module";
import {UserSetupModule} from "./UserSetup/UserSetup.module";

@NgModule({
    imports: [
        RoleMasterModule,
        PickSetupModule,
        UserSetupModule
    ]
})
export class SetupModule {
}
