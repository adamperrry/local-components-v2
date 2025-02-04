import * as React from "react";
import classnames from "classnames";
import { CopyButton } from "../../buttons/CopyButton/CopyButton";
import * as styles from "./CopyInput.scss";
import { IBasicInputProps } from "../BasicInput/BasicInput";
import { Tooltip, TooltipProps } from '../../overlays/Tooltip/Tooltip';

export interface ICopyInputProps extends IBasicInputProps {
	/* Whether value is invalid - shows the invalid state of text input if true */
	invalid?: boolean;
	/* Label to be shown above text input */
	label?: string;
	/* Message to be shown underneath an enabled input e.g. length requirement, example input, etc. */
	message?: React.ReactNode;
	/* Only show message when invalid is true - useful for only displaying error/validity CTAs */
	onlyShowMessageWhenInvalid?: boolean;
	/* Options for CopyButton Tooltip */
	copyButtonTooltipProps?: TooltipProps;
	/* Whether or not to disable the input */
	disabled?: boolean;
	/* Options for disabled input Tooltip */
	inputTooltipProps?: TooltipProps;
}

export const CopyInput = (props: ICopyInputProps) => {
	const {
		placeholder,
		value,
		onChange,
		invalid,
		disabled,
		label,
		message,
		onlyShowMessageWhenInvalid,
		copyButtonTooltipProps,
		inputTooltipProps
	} = props;

	const [textToCopy, setTextToCopy] = React.useState(value);
	React.useEffect(() => {
		setTextToCopy(value);
	}, [value]);

	const showMessage =
		!disabled &&
		(onlyShowMessageWhenInvalid ? invalid && message : !!message);
	const isInvalid = invalid && !disabled;

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newValue: string = event.target.value;
		setTextToCopy(newValue);
		onChange?.(newValue);
	};

	return (
		<div
			className={classnames(styles.CopyInput__Container, props.className)}
			id={props.id}
			style={props.style}
		>
			{label && (
				<label
					htmlFor={styles.CopyInput__Input}
					className={styles.CopyInput__Label}
				>
					{label}
				</label>
			)}
			<div
				className={classnames(styles.CopyInput, {
					[styles.__Disabled]: disabled,
					[styles.__Invalid]: isInvalid,
				})}
			>
				<Tooltip
					{...inputTooltipProps}
					hideTooltip={inputTooltipProps ? inputTooltipProps?.hideTooltip : true}
				>
					<input
						className={styles.CopyInput__Input}
						id={styles.CopyInput__Input}
						onChange={handleChange}
						placeholder={placeholder}
						type="text"
						value={textToCopy}
						disabled={disabled}
						autoComplete="off"
						spellCheck="false"
					/>
				</Tooltip>
				<Tooltip 
					className={styles.CopyInput__CopyButton} 
					{...copyButtonTooltipProps}
					hideTooltip={copyButtonTooltipProps ? copyButtonTooltipProps?.hideTooltip : true}
				>
					<CopyButton
						copiedStateIconVariant="checkmarkStroke"
						copiedStateBGStyleVariant="transparentGrayText"
						uncopiedStateBGStyleVariant="transparent"
						uncopiedStateIconVariant="copy"
						tag="button"
						copiedTimeout={1000}
						textToCopy={textToCopy}
						uncopiedStateText=""
						copiedStateText=""
					/>
				</Tooltip>
			</div>
			{showMessage && (
				<span
					className={classnames(styles.CopyInput__Message, {
						[styles.__Invalid]: isInvalid,
					})}
				>
					{message}
				</span>
			)}
		</div>
	);
};

CopyInput.defaultProps = {
	invalid: false,
	disabled: false,
	onlyShowMessageWhenInvalid: false,
};
