import {
  Form,
  FormError,
  FieldError,
  Label,
  NumberField,
  TextField,
  DatetimeLocalField,
  CheckboxField,
  Submit,
} from '@redwoodjs/forms'

import type { EditReleaseById, UpdateReleaseInput } from 'types/graphql'
import type { RWGqlError } from '@redwoodjs/forms'

const formatDatetime = (value) => {
  if (value) {
    return value.replace(/:\d{2}\.\d{3}\w/, '')
  }
}

type FormRelease = NonNullable<EditReleaseById['release']>

interface ReleaseFormProps {
  release?: EditReleaseById['release']
  onSave: (data: UpdateReleaseInput, id?: FormRelease['id']) => void
  error: RWGqlError
  loading: boolean
}

const ReleaseForm = (props: ReleaseFormProps) => {
  const onSubmit = (data: FormRelease) => {
    props.onSave(data, props?.release?.id)
  }

  return (
    <div className="rw-form-wrapper">
      <Form<FormRelease> onSubmit={onSubmit} error={props.error}>
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />

        <Label
          name="userId"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          User id
        </Label>

        <NumberField
          name="userId"
          defaultValue={props.release?.userId}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="userId" className="rw-field-error" />

        <Label
          name="songMasterReference"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Song master reference
        </Label>

        <TextField
          name="songMasterReference"
          defaultValue={props.release?.songMasterReference}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="songMasterReference" className="rw-field-error" />

        <Label
          name="songTitle"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Song title
        </Label>

        <TextField
          name="songTitle"
          defaultValue={props.release?.songTitle}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="songTitle" className="rw-field-error" />

        <Label
          name="productTitle"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Product title
        </Label>

        <TextField
          name="productTitle"
          defaultValue={props.release?.productTitle}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="productTitle" className="rw-field-error" />

        <Label
          name="artist"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Artist
        </Label>

        <TextField
          name="artist"
          defaultValue={props.release?.artist}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="artist" className="rw-field-error" />

        <Label
          name="featuredArtist"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Featured artist
        </Label>

        <TextField
          name="featuredArtist"
          defaultValue={props.release?.featuredArtist}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="featuredArtist" className="rw-field-error" />

        <Label
          name="releaseDate"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Release date
        </Label>

        <DatetimeLocalField
          name="releaseDate"
          defaultValue={formatDatetime(props.release?.releaseDate)}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="releaseDate" className="rw-field-error" />

        <Label
          name="previouslyReleased"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Previously released
        </Label>

        <CheckboxField
          name="previouslyReleased"
          defaultChecked={props.release?.previouslyReleased}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="previouslyReleased" className="rw-field-error" />

        <Label
          name="language"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Language
        </Label>

        <TextField
          name="language"
          defaultValue={props.release?.language}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="language" className="rw-field-error" />

        <Label
          name="primaryGenre"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Primary genre
        </Label>

        <TextField
          name="primaryGenre"
          defaultValue={props.release?.primaryGenre}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="primaryGenre" className="rw-field-error" />

        <Label
          name="secondaryGenre"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Secondary genre
        </Label>

        <TextField
          name="secondaryGenre"
          defaultValue={props.release?.secondaryGenre}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="secondaryGenre" className="rw-field-error" />

        <Label
          name="explicitLyrics"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Explicit lyrics
        </Label>

        <CheckboxField
          name="explicitLyrics"
          defaultChecked={props.release?.explicitLyrics}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="explicitLyrics" className="rw-field-error" />

        <Label
          name="isicUpcCode"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Isic upc code
        </Label>

        <TextField
          name="isicUpcCode"
          defaultValue={props.release?.isicUpcCode}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="isicUpcCode" className="rw-field-error" />

        <Label
          name="pLine"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          P line
        </Label>

        <TextField
          name="pLine"
          defaultValue={props.release?.pLine}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="pLine" className="rw-field-error" />

        <Label
          name="cLine"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          C line
        </Label>

        <TextField
          name="cLine"
          defaultValue={props.release?.cLine}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="cLine" className="rw-field-error" />

        <Label
          name="length"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Length
        </Label>

        <NumberField
          name="length"
          defaultValue={props.release?.length}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="length" className="rw-field-error" />

        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
            Save
          </Submit>
        </div>
      </Form>
    </div>
  )
}

export default ReleaseForm
