import * as SerialPort from "serialport";
import { config } from "./config";
import { interval, Observable, Subject } from 'rxjs';
import { bufferCount, buffer, reduce } from 'rxjs/operators';

export class DeviceCommunication {
    private openedPort: SerialPort;
    private port: string;
    private baudRate: number;

    constructor(_port: string, _baudRate: number) {
        console.log('class constructor');
        this.port = _port;
        this.baudRate = _baudRate;
    }

    public connect(): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                this.openedPort = new SerialPort(this.port, { baudRate: this.baudRate });
                this.openedPort.open(() => {
                    this.dataProccess();
                    resolve();
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    public startDaq(): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                this.sendCommand('start_daq');
                resolve();
            } catch (error) {
                reject(error)
            }
        });
    }

    public isConnected(): boolean {
        return (this.openedPort) ? this.openedPort.isOpen : false;
    }

    public disconnect(): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                this.openedPort.close(() => resolve())
            } catch (error) {
                reject(error);
            }
        });
    }

    private sendCommand(command: string): void {
        if (this.isConnected()) {
            this.openedPort.write(command);
        } else {
            throw new Error("No connected device");
        }
    }

    private bufferToArray(buffer: any) {
        return Object.keys(buffer).map((index) => {
            return buffer[index];
        });
    }

    private dataProccess(): void {
        const store = new Subject();
        const kovi = new Subject();

        this.openedPort.on('data', data => store.next(this.bufferToArray(data)));

        store.pipe(
            reduce((acc, curr: any[]) => {
                let sliced = [];
                if (acc.length === 0) {
                    sliced = this.sliceArray(curr, config.PACKET_SIZE);
                } else {
                    sliced = this.sliceArray(acc.concat(curr), config.PACKET_SIZE);
                }

                // tslint:disable-next-line: prefer-for-of
                for (let i = 0; i < sliced.length; i++) {
                    if (sliced[i].length === config.PACKET_SIZE) {
                        kovi.next(sliced[i]);
                    } else {
                        return sliced[i];
                    }
                }
                return [];

            }, []),
        ).subscribe(x => console.log('original', x));
        kovi.pipe(bufferCount(config.PACKETS_IN_BLOCK))
            .subscribe(x => console.table(x));

       /*  const subscribe = Observable.create((obs: any) => this.openedPort.on('data', data => obs.next(data))).pipe(
            bufferCount(2)
        ).subscribe((val: any) =>
            console.log('Buffered Values:', val)
        ); */
    }

    sliceArray(array: any[], columnLength: number) {
        return Array.from(
            { length: Math.ceil(array.length / columnLength) },
            (_, i) => array.slice(i * columnLength, i * columnLength + columnLength)
        )
    }


    convert(dataArr: any) {
        /* console.log('____');
        console.log(dataArr[0]);
        const length = dataArr.length;
        console.log(length);

        const buffer = Buffer.from(dataArr);

        console.log(buffer.readUInt32BE(0));
 */

       /*  let Uint8Arr = new Uint8Array(4);

        Uint8Arr[0] = 0x12;
        Uint8Arr[1] = 0x19;
        Uint8Arr[2] = 0x21;
        Uint8Arr[3] = 0x47;

        let buffer = Buffer.from(Uint8Arr); */

        // save in temp array
        // subscribe to observable (osb in sdk, subscribe in component)
        // rxjs buffer, buffercount, minden subjectbe -> sok pipe
        const uint32array = new Uint32Array(dataArr);

        console.log(uint32array);
        return 'buffer';
    }
}