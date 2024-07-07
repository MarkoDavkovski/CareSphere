"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form, FormControl } from "@/components/ui/form";
import CustomFormField from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { useState } from "react";
import { PatientFormValidation } from "@/lib/validation";
import { useRouter } from "next/navigation";
import { createUser, registerPatient } from "@/lib/actions/patient.actions";
import { FormFieldType } from "./PatientForm";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import {
  Doctors,
  GenderOptions,
  IdentificationTypes,
  PatientFormDefaultValues,
} from "@/constants";
import { Label } from "../ui/label";
import { SelectItem } from "../ui/select";
import Image from "next/image";
import FileUploader from "../FileUploader";

interface DoubleRowDivProps {
  children: React.ReactNode;
}

const DoubleRowDiv: React.FC<DoubleRowDivProps> = ({ children }) => {
  return <div className="flex flex-col gap-6 xl:flex-row">{children}</div>;
};

const RegisterForm = ({ user }: { user: User }) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: {
      ...PatientFormDefaultValues,
      name: "",
      email: "",
      phone: "",
    },
  });

  async function onSubmit(values: z.infer<typeof PatientFormValidation>) {
    setIsLoading(true);

    let formData;

    if (
      values.identificationDocument &&
      values.identificationDocument.length > 0
    ) {
      const blobFile = new Blob([values.identificationDocument[0]], {
        type: values.identificationDocument[0].type,
      });

      formData = new FormData();
      formData.append("blobFile", blobFile);
      formData.append("fileName", values.identificationDocument[0].name);
    }

    try {
      const patientData = {
        ...values,
        userId: user.$id,
        birthDate: new Date(values.birthDate),
        identificationDocument: formData,
      };
      //@ts-ignore
      const patient = await registerPatient(patientData);
      if (patient) router.push(`/patients/${user.$id}/new-appointment`);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-12 flex-1">
        <section className="space-y-4">
          <h1 className="header">Welcome 👋</h1>
          <p className="text-dark-700">Let us know more about yourself</p>
        </section>
        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Personal Information</h2>
          </div>
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            name="name"
            label="Full name"
            placeholder="John Doe"
            iconSrc="/assets/icons/user.svg"
            iconAlt="user"
          />
          <DoubleRowDiv>
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.EMAIL}
              name="email"
              label="Email address"
              placeholder="johndoe@email.com"
              iconSrc="/assets/icons/email.svg"
              iconAlt="email"
            />
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.PHONE_INPUT}
              name="phone"
              label="Phone number"
              placeholder="(+111)75 234-567"
            />
          </DoubleRowDiv>
          <DoubleRowDiv>
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.DATE_PICKER}
              name="birthDate"
              label="Date of birth"
              placeholder="johndoe@email.com"
            />
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.SKELETON}
              name="Gender"
              label="Gender"
              renderSkeleton={(field) => (
                <FormControl>
                  <RadioGroup
                    className="flex h-11 gap-6 xl:justify-between"
                    onValueChange={field.onChange}
                    defaultValue={field.value}>
                    {GenderOptions.map((option) => (
                      <div key={option} className="radio-group">
                        <RadioGroupItem value={option} id={option} />
                        <Label htmlFor={option} className="cursor-pointer">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
              )}
            />
          </DoubleRowDiv>
          <DoubleRowDiv>
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              name="address"
              label="Address"
              placeholder="Bul. Partizanski Odredi 21/2/3"
            />
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              name="occupation"
              label="Occupation"
              placeholder="Software Engineer"
            />
          </DoubleRowDiv>

          <DoubleRowDiv>
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.EMAIL}
              name="emergencyContactName"
              label="Emergency contact name"
              placeholder="Guardian's name"
            />
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.PHONE_INPUT}
              name="emergencyContactNumber"
              label="Emergency contact number"
              placeholder="(+111)75 234-567"
            />
          </DoubleRowDiv>
        </section>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Medical Information</h2>
          </div>
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.SELECT}
            name="primaryPhysician"
            label="Primary physician"
            placeholder="Select a physician">
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

          <DoubleRowDiv>
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              name="insuranceProvider"
              label="Insurance provider"
              placeholder="BlueCross BlueShield"
            />
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              name="insurancePolicyNumber"
              label="Insurance policy number"
              placeholder="ABC123456GE"
            />
          </DoubleRowDiv>

          <DoubleRowDiv>
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.TEXTAREA}
              name="allergies"
              label="Allergies (if any)"
              placeholder="Palates, peanuts, gluten"
            />
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.TEXTAREA}
              name="currentMedication"
              label="Current medication (if any)"
              placeholder="Aspirin 200mg, ibuprofen 100mg"
            />
          </DoubleRowDiv>

          <DoubleRowDiv>
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.TEXTAREA}
              name="familyMedicalHistory"
              label="Family medical history"
              placeholder="Mother had a brain cancer, father had a stroke"
            />
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.TEXTAREA}
              name="pastMedicalHistory"
              label="Past medical history"
              placeholder="Appendectomy, heart attack"
            />
          </DoubleRowDiv>
        </section>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Identification & Verification</h2>
          </div>

          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.SELECT}
            name="identificationType"
            label="Identification type"
            placeholder="Select identification type">
            {IdentificationTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </CustomFormField>

          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            name="identificationNumber"
            label="Identification number"
            placeholder="123456789"
          />

          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.SKELETON}
            name="identificationDocument"
            label="Scanned copy of identification document"
            renderSkeleton={(field) => (
              <FormControl>
                <FileUploader
                  files={field.value}
                  onChange={field.onChange}></FileUploader>
              </FormControl>
            )}
          />
        </section>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Consent and Privacy</h2>
          </div>
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.CHECKBOX}
            name="treatmentConsent"
            label="I accept the treatment consent"
          />
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.CHECKBOX}
            name="disclosureConsent"
            label="I consent to the disclosure of my personal information"
          />{" "}
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.CHECKBOX}
            name="privacyConsent"
            label="I consent to the privacy policy"
          />
        </section>

        <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
      </form>
    </Form>
  );
};
export default RegisterForm;
