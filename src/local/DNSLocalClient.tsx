import fs from "fs";
import {AcmeDNSClientAbstract} from "../AcmeDNSClientAbstract";

type Props = {
  challengePath: string;
};

export default class DNSLocalClient extends AcmeDNSClientAbstract {
  props: Props;

  path: string;

  constructor(props: Props) {
    super();
    this.props = props;
    this.path = props.challengePath;
  }

  createRecord<T = any>(options: {
    name: string;
    type: "TXT" | "A" | "CNAME";
    value: string;
    domain: string;
    challenge: any;
    token: string;
    [prop: string]: any;
  }): Promise<T> {
    return new Promise((resolve, reject) => {

      console.log("Write file", this.getFilePath(options.token));

      fs.writeFile(this.getFilePath(options.token), options.value, (err) => {
        if (err) {
          reject(err);
          return;
        }

        resolve({} as any);
      })
      
    });
  }

  removeRecord<T = any>(options: {
    domain: string;
    dnsRecord: any;
    token: string;
  }): Promise<T> {
    return new Promise((resolve, reject) => [
      fs.unlink(this.getFilePath(options.token), (err) => {
        if (err) {
          reject(err);
          return;
        }

        resolve({} as any);
      }),
    ]);
  }

  private getFilePath(name: string) {
    return `${this.path}/${name}`;
  }
}
