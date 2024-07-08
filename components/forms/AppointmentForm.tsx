"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form } from "@/components/ui/form";
import CustomFormField from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { useState } from "react";
import { getAppointmentSchema } from "@/lib/validation";
import { useRouter } from "next/navigation";
import { FormFieldType } from "./PatientForm";
import { SelectItem } from "../ui/select";
import Image from "next/image";
import { Doctors } from "@/constants";
import { CreateAppointment } from "@/lib/actions/appointment.actions";

const AppointmentForm = ({
  userId,
  patientId,
  type = "create",
}: {
  userId: string;
  patientId: string;
  type: "create" | "cancel" | "schedule";
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const AppointmentFormValidation = getAppointmentSchema(type);

  const form = useForm<z.infer<typeof AppointmentFormValidation>>({
    resolver: zodResolver(AppointmentFormValidation),
    defaultValues: {
      primaryPhysician: "",
      schedule: new Date(),
      reason: "",
      note: "",
      cancellationReason: "",
    },
  });

  async function onSubmit(values: z.infer<typeof AppointmentFormValidation>) {
    setIsLoading(true);

    let status;
    switch (type) {
      case "schedule":
        status = "scheduled";
        break;
      case "cancel":
        status = "cancelled";
      default:
        status = "pending";
        break;
    }
    try {
      console.log(type, patientId);
      if (type === "create" && patientId) {
        const appointmentData = {
          userId,
          patient: patientId,
          primaryPhysician: values.primaryPhysician,
          schedule: new Date(values.schedule),
          reason: values.reason!,
          note: values.note,
          status: status as Status,
        };
        const appointment = await CreateAppointment(appointmentData);

        if (appointment) {
          form.reset();
          router.push(
            `/patient/${patientId}/new-appointment/success?appointmentId=${appointment.$id}`
          );
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }
  let buttonLabel;
  switch (type) {
    case "create":
      buttonLabel = "Create appointment";
      break;

    case "cancel":
      buttonLabel = "Cancel appointment";
      break;
    case "schedule":
      buttonLabel = "Schedule appointment";
      break;
    default:
      break;
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        <section className="mb-12 space-y-4">
          <h1 className="header">New Appointment</h1>
          <p className="text-dark-700">
            Request a new appointment in{" "}
            <span className="text-blue-500">10</span> seconds
          </p>
        </section>

        {type !== "cancel" && (
          <>
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.SELECT}
              name="primaryPhysician"
              label="Doctor"
              placeholder="Select a doctor">
              {Doctors.map((doctor) => (
                <SelectItem key={doctor.name} value={doctor.name}>
                  <div className="flex cursor-pointer items-center gap-2">
                    <Image
                      src={doctor.image}
                      width={32}
                      height={32}
                      alt={doctor.image}
                      className="rounded-full border border-dark-500"
                    />
                    <p>{doctor.name}</p>
                  </div>
                </SelectItem>
              ))}
            </CustomFormField>
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.DATE_PICKER}
              name="Schedule"
              label="Expected appointment date"
              placeholder="10/10/2010 - 10:00 AM"
              showTimeSelect
              dateFormat="dd/MM/yyyy - h:mm aa"
            />
            <div className="flex flex-col xl:flex-row gap-6">
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.TEXTAREA}
                name="reason"
                label="Reason for the appointment"
                placeholder="Enter the reason for the appointment"
              />
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.TEXTAREA}
                name="note"
                label="Notes"
                placeholder="Enter any additional notes"
              />
            </div>
          </>
        )}

        {type === "cancel" && (
          <>
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.TEXTAREA}
              name="cancellationReason"
              label="Reason for cancellation"
              placeholder="Enter the reason for the cancellation"
            />
          </>
        )}

        <SubmitButton
          isLoading={isLoading}
          className={`${
            type === "cancel" ? "shad-danger-btn" : "bg-green-700"
          } w-full`}>
          {buttonLabel}
        </SubmitButton>
      </form>
    </Form>
  );
};
export default AppointmentForm;
