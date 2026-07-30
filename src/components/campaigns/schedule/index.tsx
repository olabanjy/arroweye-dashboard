import Schedule from "./component/Schedule";
import Head from "next/head";

const SchedulePage = () => {
  return (
    <>
      <Head>
        <title>Schedules - Arroweye</title>
      </Head>

      <Schedule isDateClickEnabled={true} isSchedulePage={true} />
    </>
  );
};

export default SchedulePage;
