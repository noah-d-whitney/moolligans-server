import { ReturnReason } from "@medusajs/medusa"
import { useAdminCreateReturnReason } from "medusa-react"
import { useForm } from "react-hook-form"
import Button from "../../../components/fundamentals/button"
import Input from "../../../components/molecules/input"
import Modal from "../../../components/molecules/modal"
import TextArea from "../../../components/molecules/textarea"
import useNotification from "../../../hooks/use-notification"
import FormValidator from "../../../utils/form-validator"

type CreateReturnReasonModalProps = {
  handleClose: () => void
  initialReason?: ReturnReason
}

type CreateReturnReasonFormData = {
  value: string
  label: string
  description: string | null
}

// the reason props is used for prefilling the form when duplicating
const CreateReturnReasonModal = ({
  handleClose,
  initialReason,
}: CreateReturnReasonModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateReturnReasonFormData>({
    defaultValues: {
      value: initialReason?.value,
      label: initialReason?.label,
      description: initialReason?.description,
    },
  })
  const notification = useNotification()
  const { mutateAsync, isLoading } = useAdminCreateReturnReason()

  const onCreate = async (data: CreateReturnReasonFormData) => {
    try {
      await mutateAsync({
        ...data,
        description: data.description || undefined,
      })
      notification("Success", "Created a new return reason", "success")
    } catch {
      notification(
        "Error",
        "Cannot create a return reason with an existing value",
        "error"
      )
    }
    handleClose()
  }

  return (
    <Modal handleClose={handleClose}>
      <Modal.Body>
        <Modal.Header handleClose={handleClose}>
          <span className="inter-xlarge-semibold">Add Reason</span>
        </Modal.Header>
        <form onSubmit={handleSubmit(onCreate)}>
          <Modal.Content>
            <div className="gap-large mb-large grid grid-cols-2">
              <Input
                {...register("value", {
                  required: "Value is required",
                  pattern: FormValidator.whiteSpaceRule("Value"),
                  minLength: FormValidator.minOneCharRule("Value"),
                })}
                label="Value"
                required
                placeholder="wrong_size"
                errors={errors}
              />
              <Input
                {...register("label", {
                  required: "Label is required",
                  pattern: FormValidator.whiteSpaceRule("Label"),
                  minLength: FormValidator.minOneCharRule("Label"),
                })}
                label="Label"
                required
                placeholder="Wrong size"
                errors={errors}
              />
            </div>
            <TextArea
              className="mt-large"
              rows={3}
              {...register("description")}
              label="Description"
              placeholder="Customer received the wrong size"
              errors={errors}
            />
          </Modal.Content>
          <Modal.Footer>
            <div className="flex h-8 w-full justify-end">
              <Button
                variant="ghost"
                className="text-small mr-2 w-32 justify-center"
                size="large"
                onClick={handleClose}
                type="button"
              >
                Cancel
              </Button>
              <Button
                loading={isLoading}
                disabled={isLoading}
                size="large"
                className="text-small w-32 justify-center"
                variant="primary"
              >
                Create
              </Button>
            </div>
          </Modal.Footer>
        </form>
      </Modal.Body>
    </Modal>
  )
}

export default CreateReturnReasonModal
