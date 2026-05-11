import {
  NextResponse,
} from "next/server";

const DATABASE_URL =
  process.env
    .NEXT_PUBLIC_FIREBASE_DATABASE_URL;

type FirebaseLog = {
  distance: number;

  ph: number;
  ph_raw: number;

  ph_status: string;

  ph_voltage: number;

  temperature: number;

  timestamp: number;

  turbidity: number;

  water_condition: string;
};

function isValidLog(
  log: FirebaseLog
) {
  return (
    log.timestamp > 0 &&
    log.temperature > -50 &&
    log.ph >= 0 &&
    log.ph <= 14
  );
}

export async function GET() {
  try {

    const response =
      await fetch(
        `${DATABASE_URL}/devices/device_1/logs.json`,
        {
          cache: "no-store",
        }
      );

    const data =
      await response.json();

    if (!data) {
      return NextResponse.json(
        []
      );
    }

    const logs =
      Object.values(
        data
      ) as FirebaseLog[];

    const cleanedLogs =
      logs
        .filter(isValidLog)

        .sort(
          (a, b) =>
            a.timestamp -
            b.timestamp
        )
        .slice(-30);

    return NextResponse.json(
      cleanedLogs
    );

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error:
          "Failed to fetch logs",
      },

      {
        status: 500,
      }
    );
  }
}