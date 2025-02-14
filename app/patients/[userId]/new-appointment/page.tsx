import AppointmentForm from "@/components/forms/AppointmentForm";
import { getPatientById } from "@/lib/actions/patient.actions";
import Image from "next/image";

import * as Sentry from "@sentry/nextjs";

const NewAppointment = async ({ params: { userId } }: SearchParamProps) => {
  const patient = await getPatientById(userId);

  Sentry.metrics.set("user_view_new-appointment", patient.name);

  return (
    <main className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[860px] flex-1 justify-between">
          <Image
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="patient"
            className="mb-12 h-10 w-fit"
          />
          <AppointmentForm
            type="create"
            userId={userId}
            patientId={patient?.$id}
          />
          <p className="copyright my-10 py-12">©2024 CareSphere</p>
        </div>
      </section>
      <Image
        src="/assets/images/appointment-img.png"
        height={1000}
        width={1000}
        alt="patient"
        className="side-img max-w-[390px] bg-bottom"
      />
    </main>
  );
};
export default NewAppointment;
