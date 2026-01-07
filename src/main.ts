import { MarkdownView, Notice, Plugin } from "obsidian";

export default class Prettier extends Plugin {
	async onload() {
		this.addRibbonIcon(
			"sparkles",
			"Форматировать файл",
			(evt: MouseEvent) => {
				const markdownView = this.getView();
				if (markdownView) this.formatFile(markdownView);
			}
		);

		this.addCommand({
			id: "format-file",
			name: "Форматировать файл",
			checkCallback: (checking: boolean) => {
				const markdownView = this.getView();
				if (markdownView) {
					if (!checking) {
						this.formatFile(markdownView);
					}

					return true;
				}
				return false;
			},
			hotkeys: [{ modifiers: ["Shift"], key: "f" }],
		});
	}

	formatFile(markdownView: MarkdownView) {
		let editor = markdownView.editor;
		let selection = editor.getSelection();
		let hasSelection = !this.isEmpty(selection);
		let text = hasSelection ? selection : editor.getValue();
		text = text
			.split(/\n(?!\s*---)/g)
			.filter((line) => !this.isEmpty(line))
			.join("\n");
		if (hasSelection) {
			editor.replaceSelection(text);
			new Notice("Выделенный фрагмент отформатирован!");
		} else {
			let { top, left } = editor.getScrollInfo();
			editor.setValue(text);
			setTimeout(() => editor.scrollTo(left, top), 1);
			new Notice("Файл отформатирован!");
		}
	}

	getView(): MarkdownView | null {
		return this.app.workspace.getActiveViewOfType(MarkdownView);
	}

	isEmpty(text: string): boolean {
		return text.trim().length === 0;
	}
}
