import { expect } from "chai";
import { injectable, inject } from "inversify";
import Kernel from "kernel/Kernel";

describe("Kernel Container Tests", () => {
  it("Can bind classes", () => {
    interface Ninja {
            fight(): string;
            sneak(): string;
        }

        interface Katana {
            hit(): string;
        }

        interface Shuriken {
            throw(): string;
        }

        @injectable()
        class Katana implements Katana {
            public hit() {
                return "cut!";
            }
        }

        @injectable()
        class Shuriken implements Shuriken {
            public throw() {
                return "hit!";
            }
        }

        @injectable()
        class Ninja implements Ninja {

            private _katana: Katana;
            private _shuriken: Shuriken;

            public constructor(
                @inject("Katana") katana: Katana,
                @inject("Shuriken") shuriken: Shuriken
            ) {
                this._katana = katana;
                this._shuriken = shuriken;
            }

            public fight() {return this._katana.hit(); }
            public sneak() { return this._shuriken.throw(); }

        }

        class Ninja2 extends Ninja {
          public fight() {return "lolol"; }
        }

        const container = new Kernel();
        container.bind<Ninja2>("Ninja").to(Ninja2);
        container.bind<Katana>("Katana").to(Katana);
        container.bind<Shuriken>("Shuriken").to(Shuriken);

        const ninja = container.get<Ninja2>("Ninja");

        expect(ninja.fight()).eql("lolol");
        expect(ninja.sneak()).eql("hit!");
  });
});
