import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TimeIntervalComponent } from './time-interval.component';

const routes: Routes = [
    {
        path: '',
        component: TimeIntervalComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class TimeIntervalRoutingModule {}
