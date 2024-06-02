import React, { useState } from "react";
import WalletNewDeposit from "./WalletNewDeposit";
import WalletNewWithdraw from './WalletNewWithdraw';
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

const tabType = {
	deposit: 'deposit',
	withdraw: 'withdraw'
}

function MainWalletModalContent() {
	const dispatch = useDispatch();
	// đa ngôn ngữ 
	const { t } = useTranslation();

	// tab
	const [tabSelected, setTabSelected] = useState(tabType.deposit);
	const tabClickHandle = (tab) => {
		setTabSelected(tab);
	}
	const renderActive = (tab) => {
		return tab === tabSelected ? "active" : '';
	}
	const renderContent = () => {
		switch (tabSelected) {
			case tabType.deposit:
				return <WalletNewDeposit />;
			case tabType.withdraw:
				return <WalletNewWithdraw />
			default:
				break;
		}
	}

	return (
		<div className="main-wallet-modal">
			<div className="header">
				<div
					className={`item ${renderActive(tabType.deposit)}`}
					onClick={tabClickHandle.bind(null, tabType.deposit)}
				>
					{t("deposit")}
				</div>
				<div
					className={`item ${renderActive(tabType.withdraw)}`}
					onClick={tabClickHandle.bind(null, tabType.withdraw)}
				>
					{t('withdraw')}
				</div>
			</div>
			<div className="content">
				{renderContent()}
			</div>
		</div>
	)
}
export default MainWalletModalContent;
