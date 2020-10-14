import {NgModule} from '@angular/core';
import {Manifest_postingModule} from "./manifest_posting/manifest_posting.module";
import {ManifestHandOverModule} from "./ManifestHandOver/ManifestHandOver.module";
import {ManifestsortingModule} from "./manifestsorting/manifestsorting.module";
import {ReshipmentModule} from "./reshipment/reshipment.module";

@NgModule({
    imports: [
        Manifest_postingModule,
        ManifestHandOverModule,
        ReshipmentModule,
        ManifestsortingModule
    ]
})
export class ManifestPageModule {
}
