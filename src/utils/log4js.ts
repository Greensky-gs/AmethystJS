import { existsSync, readFileSync, writeFileSync } from "fs";

const configs = {
    displayTime: true,
    displayTimeFormat: (time: Date) => `[${time.getDay()}/${time.getMonth()}/${time.getFullYear()}:${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}]`,
    file: 'logs.log' as `${string}.${string}`,
    objectIndentation: 4
}

const config = <Key extends keyof typeof configs>(key: Key, value: typeof configs[Key]) => {
    if (!key) {
        console.log(`[!!] The key isn't a valid key value`);
        return;
    }
    if (typeof value !== typeof configs[key]) {
        console.log(`[!!] The value used as argument isn't a valid value type`)
        return;
    }

    configs[key] = value;
}

const trace = (log: any) => {
    const date = configs.displayTimeFormat(new Date());
    const content = typeof log === 'object' ? JSON.stringify(log, null, configs.objectIndentation) : log;

    if (!existsSync(configs.file)) writeFileSync(configs.file, `       d8888                        888    888                        888           888888  .d8888b.  
    d88888                        888    888                        888             "88b d88P  Y88b 
   d88P888                        888    888                        888              888 Y88b.      
  d88P 888 88888b.d88b.   .d88b.  888888 88888b.  888  888 .d8888b  888888           888  "Y888b.   
 d88P  888 888 "888 "88b d8P  Y8b 888    888 "88b 888  888 88K      888              888     "Y88b. 
d88P   888 888  888  888 88888888 888    888  888 888  888 "Y8888b. 888              888       "888 
d8888888888 888  888  888 Y8b.     Y88b.  888  888 Y88b 888      X88 Y88b.            88P Y88b  d88P 
d88P     888 888  888  888  "Y8888   "Y888 888  888  "Y88888  88888P'  "Y888           888  "Y8888P"  
                                                       888                         .d88P            
                                                  Y8b d88P                       .d88P"             
                                                   "Y88P"                       888P"               

Logs
Started ${date}
`)

    const trace = `${configs.displayTime ? `${date} ` : ''}${content}`
    writeFileSync(configs.file, `${readFileSync(configs.file).toString()}\n${trace}`);
}

export {
    trace,
    config
}