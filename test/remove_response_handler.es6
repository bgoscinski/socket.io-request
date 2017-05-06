/* eslint-env mocha */

import { assert } from "chai";
import { Server, port } from "./helper";

import Client from "socket.io-client";

import ioreq from "../";

const server = Server();

describe("response method", function () {
  it("should return function allowing to remove response handler", function (done) {
    this.timeout(2000);

    let removeHandler;
    server.on("connection", (socket) => {
      removeHandler = ioreq(socket).response("toUpper", (req, res) => {
        res(req.str.toUpperCase());
      });

      assert.equal(typeof removeHandler, 'function');
    });

    const client = Client(`http://localhost:${port}`);
    client.once("connect", async () => {
      const io = ioreq(client, { timeout: 1000 });

      const str1 = await io.request("toUpper", { str: "hello" });
      assert.equal(str1, "HELLO");

      removeHandler();

      let str2, err;
      try {
        str2 = await io.request("toUpper", { str: "i should fail" });
      }
      catch (_err) {
        err = _err;
      }

      assert.isUndefined(str2);
      assert.equal(err.name, "TimeoutError");
      done();
    });
  });
});
