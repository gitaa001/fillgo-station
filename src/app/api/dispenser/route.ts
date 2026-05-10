import { db } from "@/lib/firebase";

import {
  ref,
  get,
} from "firebase/database";

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

    const logs = snapshot.val();

    // AMBIL LOG TERAKHIR
    const latestKey =
    Object.keys(logs).pop();

    if (!latestKey) {
    return Response.json(
        {
        error: "No latest log found",
        },
        {
        status: 404,
        }
    );
    }

    const latestData =
    logs[latestKey];

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