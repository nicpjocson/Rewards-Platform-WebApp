import React from "react";
import { 
	Card,
	Title,
	Input,
	Label,
	CardRow,
	SideButton
} from "@/components/CardPage/CardPage";
import BaseModal, { BaseModalProps } from "@/components/Modal/BaseModal";
import { useForm } from "react-hook-form";
import { FormContainer, useFormError } from "@/components/Providers/Forms";
import { useShops } from "@/components/Providers/Products/Products";

const CreateBrandModal: React.FC<BaseModalProps> = ({
	state
}) => {
	const { createShop: createBrand } = useShops();
	const form = useForm();
	const toast = useFormError(form);
	const close = () => state[1](false);
	const handleSubmit = form.handleSubmit(async (data) => {
		await createBrand(data.name);
		close();
		form.reset();
	});
	return (
		<BaseModal state={state}>
		<FormContainer form={form}>
		<Card>
			<Title>Create Brand</Title>
			<Label>
				Brand Name
				<Input placeholder="Brand Name" id="name" 
					options={{required: "name is required"}}/>
			</Label>
			<CardRow>
				<SideButton onClick={close} color="gray">
					Cancel
				</SideButton>
				<SideButton onClick={handleSubmit} color="blue">
					Create
				</SideButton>
			</CardRow>
		</Card>
		</FormContainer>
		</BaseModal>
	);
}

export default CreateBrandModal;