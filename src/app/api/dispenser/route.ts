import { db } from "@/lib/firebase";

import {
  ref,
  get,
} from "firebase/database";

type SensorLog = {
  distance?: number;

  ph: number;

  ph_status: string;

  temperature: number;

  turbidity: number;

  water_condition: string;

  timestamp: number;
};

export async function GET() {

  try {

    const logsRef = ref(
      db,
      "devices/device_1/logs"
    );

    const snapshot =
      await get(logsRef);

    if (!snapshot.exists()) {

      return Response.json(
        {
          error:
            "No sensor data found",
        },
        {
          status: 404,
        }
      );
    }

    const logs =
      snapshot.val();

    // OBJECT → ARRAY
    const logsArray:
      SensorLog[] =
        Object.values(
          logs
        );

    // FILTER LOG VALID
    const validLogs =
      logsArray.filter(
        (log) =>

          typeof log.timestamp ===
            "number" &&

          log.temperature !==
            -127 &&

          typeof log.ph ===
            "number" &&

          typeof log.turbidity ===
            "number"
      );

    if (
      validLogs.length ===
      0
    ) {

      return Response.json(
        {
          error:
            "No valid sensor logs found",
        },
        {
          status: 404,
        }
      );
    }

    // SORT TERBARU
    const latestData =
      validLogs.sort(
        (a, b) =>
          b.timestamp -
          a.timestamp
      )[0];

    // RETURN CLEAN RESPONSE
    return Response.json({
      ph: latestData.ph,

      ph_status:
        latestData.ph_status,

      temperature:
        latestData.temperature,

      turbidity:
        latestData.turbidity,

      water_condition:
        latestData.water_condition,

      timestamp:
        latestData.timestamp,
    });

  } catch (error) {

    console.error(error);

    return Response.json(
      {
        error:
          "Failed to fetch sensor data",
      },
      {
        status: 500,
      }
    );
  }
}