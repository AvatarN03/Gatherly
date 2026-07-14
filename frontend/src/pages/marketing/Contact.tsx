import { useRef } from "react";
import { useForm, ValidationError } from "@formspree/react";
import {
  ArrowRight,
} from "lucide-react";
import toast from "react-hot-toast";
import { PRIORITIES, SUBJECTS } from "../../constant";






export default function Contact() {
  const [state, handleSubmit] = useForm(
    import.meta.env.VITE_FORMSPREE_ID
  );

  const formRef = useRef<HTMLFormElement>(null);

  // Replace with Clerk later if needed
  const user = {
    name: "",
    email: "",
  };

  const onSubmit = async (
    e: React.SubmitEvent<HTMLFormElement>
  ) => {
    await handleSubmit(e);

    if (!state.errors) {
      toast.success("Message sent successfully!");

      formRef.current?.reset();
    }
  };

  return (
    <section className="min-h-screen bg-background py-10">
      <div className="mx-auto max-w-350 px-2 md:px-6">

        {/* Header */}

        <div className="">

          <h1 className="text-3xl font-medium text-fog">
            Contact Gatherly
          </h1>

          <p className="tracking-wider leading-normal text-xs md:text-lg text-fog/50 mb-8">
            Have a question, found a bug, or want to suggest a
            feature? We'd love to hear from you.
          </p>

        </div>


        <div className=" max-w-3xl rounded-xl border border-cocoa bg-deep-ocean/60 p-4 md:p-8 shadow-sm">

          <form
            ref={formRef}
            onSubmit={onSubmit}
            className="space-y-6"
          >

            <div className="grid md:grid-cols-2 gap-6 text-lavender">

              <div>

                <label className="mb-2 block font-medium">
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  required
                  defaultValue={user.name}
                  placeholder="John Doe"
                  className="w-full rounded-md border border-fog/30  bg-slate px-4 py-2 outline-none transition focus:border-orchid"
                />

                <ValidationError
                  prefix="Name"
                  field="name"
                  errors={state.errors}
                />

              </div>

              <div>

                <label className="mb-2 block font-medium">
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  required
                  defaultValue={user.email}
                  placeholder="john@example.com"
                  className="w-full rounded-md border border-fog/30  bg-slate px-4 py-2 outline-none transition focus:border-orchid"
                />

                <ValidationError
                  prefix="Email"
                  field="email"
                  errors={state.errors}
                />

              </div>

            </div>

            <div className="grid md:grid-cols-2 gap-6">

              <div>

                <label className="mb-2 block font-medium">
                  Subject
                </label>

                <select
                  name="subject"
                  required
                  className="w-full text-fog/80 rounded-md border border-fog/30  bg-slate px-4 py-2 outline-none transition focus:border-orchid cursor-pointer"
                >

                  <option value="">
                    Choose Subject
                  </option>

                  {SUBJECTS.map((subject) => (
                    <option
                      key={subject}
                      value={subject}
                    >
                      {subject}
                    </option>
                  ))}

                </select>

              </div>

              <div>

                <label className="mb-2 block font-medium">
                  Priority
                </label>

                <select
                  name="priority"
                  className="w-full text-fog/80 rounded-md border border-fog/30  bg-slate px-4 py-2 outline-none transition focus:border-orchid"
                >

                  {PRIORITIES.map(priority => (
                    <option
                      key={priority}
                      value={priority}
                    >
                      {priority}
                    </option>
                  ))}

                </select>

              </div>

            </div>

            <div>

              <label className="mb-2 block font-medium">
                Community / Event (Optional)
              </label>

              <input
                type="text"
                name="community/event"
                placeholder="Community or Event Name"
                className="w-full rounded-md border border-fog/30  bg-slate px-4 py-2 outline-none transition focus:border-orchid"
              />

            </div>

            <div>

              <label className="mb-2 block font-medium">
                Message
              </label>

              <textarea
                name="message"
                rows={6}
                required
                placeholder="Tell us how we can help..."
                className="w-full rounded-md border border-fog/30 bg-background px-4 py-3 outline-none resize-none focus:border-orchid"
              />

              <ValidationError
                prefix="Message"
                field="message"
                errors={state.errors}
              />

            </div>

            <label className="flex items-center gap-3 text-sm">

              <input
                required
                type="checkbox"
                className="h-4 w-4 rounded border-fog/30 bg-background text-orchid focus:ring-orchid checked:bg-cocoa"
              />

              <span className="text-fog/70">

                I understand this message will be sent to
                the Gatherly team.

              </span>

            </label>

            <button
              disabled={state.submitting}
              className="flex w-full items-center justify-center gap-3 rounded-xl bg-orchid px-5 py-4 font-semibold text-mist transition hover:opacity-90 disabled:opacity-50 cursor-pointer"
            >

              {state.submitting
                ? "Sending..."
                : "Send Message"}

              <ArrowRight size={18} />

            </button>

          </form>

          <div className="flex items-center gap-2 mt-8 justify-end">

            <div className="rounded-xl bg-orchid/15 p-1">
              <img src="/github.png" alt="GitHub" className="w-5 h-5 text-orchid" />
            </div>



            <a
              href="https://github.com/AvatarN03"
              target="_blank"
              className="text-sm text-orchid hover:underline"
            >
              github.com/AvatarN03
            </a>



          </div>

        </div>



      </div>

    </section>

  );
}