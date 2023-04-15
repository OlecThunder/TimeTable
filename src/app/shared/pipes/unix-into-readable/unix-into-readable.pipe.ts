import { Pipe, PipeTransform } from "@angular/core";
import * as dayjs from "dayjs";

@Pipe({
    name: 'unixIntoReadable',
    pure: true
})
export class UnixIntoReadablePipe implements PipeTransform {
    transform(value: string): string {
        return dayjs.unix(+value).format('HH:mm');
    }
}