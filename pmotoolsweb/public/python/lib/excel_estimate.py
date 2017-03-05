import lib.excelfile

from xlsxwriter.utility import xl_rowcol_to_cell

gl_col_width = []

class ExcelEstimate (lib.excelfile.ExcelFile):

    def __init__(self, workbook_name, worksheet_name, in_memory):
        lib.excelfile.ExcelFile.__init__(self, workbook_name, worksheet_name, in_memory)

    def init_report(self, project_data):
        lib.excelfile.ExcelFile.init_report(self)

        self.col_widths = {"0": 80, "1": 18, "2": 12, "3": 10, "4": 14}

        self._f_tc = self.workbook.add_format({'bg_color': 'white', 'border': 1, 'text_wrap': True})
        self._f_header = self.workbook.add_format({'bg_color': '6666FF', 'font_color': 'black', 'font_size': 11,
                                               'border': 1, 'align': 'center', 'valign': 'vcenter',
                                               'text_wrap': True, 'bold': True})
        self._f_subheader = self.workbook.add_format({'bg_color': '31B1FF', 'font_color': 'black', 'font_size': 11,
                                               'border': 1, 'align': 'left', 'valign': 'vcenter',
                                               'text_wrap': True, 'bold': True})

        self.data = project_data
        self.last_row = 0

    def _build_formula(self, row1, col1, row2, col2, sign):
        cellA = xl_rowcol_to_cell(row1, col1)
        cellB = xl_rowcol_to_cell(row2, col2)
        if sign == 'SUM':
            return 'SUM(' + cellA + ':' + cellB + ')'
        return '=' + cellA + sign + cellB

    def generate_report(self,show_subtasks=False):
        self._write_top_header()
        self._write_report_header()
        self._write_task_list(self.data['show_subtasks'])

    def _write_empty_line(self, row, start_col, cols_count):
        for i in range(cols_count):
            self._write_cell(start_col + i, row, "", self._f_lane)

    def _write_top_header(self):
        for i in range(2):
            self._write_empty_line(i, 0, 5)
            self.last_row += 1

        self.insert_image('A1', './logo.png')
        company_header = ["DreamLab Spółka z o.o.", "ul. Pilotów 10, 31-462 Kraków",
                         "Tel./Fax: +48 12 618 46 00, Email: office@dreamlab.pl",
                         "Sąd Rejestrowy: Sąd Rejonowy dla Krakowa Śródmieścia",
                         "XI  Wydział Gospodarczy Krajowego Rejestru Sądowego",
                         "KRS: 0000258095, Kapitał zakładowy: 50 000,00 zł",
                         "NIP: 675-13-44-074, Regon: 120260774"]

        for i, elem in enumerate(company_header):
            self._write_empty_line(self.last_row, 0, 1)

            lane_format = self._f_lane_right
            if i == 0:
                lane_format = self._f_lane_right_bold
            self._write_cell(4, self.last_row, elem, lane_format)
            self.last_row += 1

        project_header = ["Załącznik nr 2 do Porozumienia Wykonawczego nr ………..",
                         "Kosztorys prac projektu " + self.data['projectName']]

        for i, elem in enumerate(project_header):
            self._write_cell(0, self.last_row, elem, self._f_lane_bold)
            self._write_empty_line(self.last_row, 1, 4)
            self.last_row += 1

        # set one line break
        self._write_empty_line(self.last_row, 0, 5)
        self.last_row += 1

    def _write_report_header(self):
        headers = ["Zadanie", "Rola w projekcie", "Roboczogodziny", "Stawka godzinowa netto", "Wycena netto"]
        self.last_row = self._write_table_header(self.last_row, headers, self._f_header)

    def _write_task_list(self, show_subtasks=False):
        if self.data['issues'] is not None:

            start_of_sum = self.last_row

            section_mgm_analysis = False
            section_project = False
            for main_issue in self.data['issues']:
                # parent
                ts = int(main_issue.timespent * 10)
                is_reported = main_issue.totaltimespent > 0
                has_children = len(main_issue.children) != 0

                if not main_issue.not_management_task or not main_issue.not_analysis_task:
                    if not section_mgm_analysis:
                        section_mgm_analysis = True
                        self._write_cell(0, self.last_row, "Analiza i zarządzanie", self._f_subheader)
                        self._write_cell(1, self.last_row, "", self._f_subheader)
                        self._write_cell(2, self.last_row, "", self._f_subheader)
                        self._write_cell(3, self.last_row, "", self._f_subheader)
                        self._write_cell(4, self.last_row, "", self._f_subheader)
                        self.last_row += 1
                elif section_mgm_analysis and not section_project:
                    section_project = True
                    self._write_cell(0, self.last_row, "Projekt", self._f_subheader)
                    self._write_cell(1, self.last_row, "", self._f_subheader)
                    self._write_cell(2, self.last_row, "", self._f_subheader)
                    self._write_cell(3, self.last_row, "", self._f_subheader)
                    self._write_cell(4, self.last_row, "", self._f_subheader)
                    self.last_row += 1

                if (not show_subtasks and is_reported)\
                        or (show_subtasks and not has_children and is_reported)\
                        or (show_subtasks and ts > 0):
                    self._write_cell(0, self.last_row, main_issue.summary, self._f_tc)
                    self._write_cell(1, self.last_row, "Programista", self._f_tc)
                    if ts > 0 and show_subtasks:
                        self._write_cell(2, self.last_row, main_issue.timespent, self._f_tc)
                    else:
                        self._write_cell(2, self.last_row, main_issue.totaltimespent, self._f_tc)
                    self._write_cell(3, self.last_row, 107, self._f_lane_currency)
                    self.write_formula(4, self.last_row,
                                       self._build_formula(self.last_row, 2, self.last_row, 3, "*"),
                                       self._f_lane_currency)
                    self.last_row += 1
                # all subtasks
                if show_subtasks:
                    for sub_issue in main_issue.children:
                        if sub_issue.totaltimespent > 0:
                            self._write_cell(0, self.last_row, main_issue.summary + " - " + sub_issue.summary, self._f_tc)
                            self._write_cell(1, self.last_row, "Programista", self._f_tc)
                            self._write_cell(2, self.last_row, sub_issue.totaltimespent, self._f_tc)
                            self._write_cell(3, self.last_row, 107, self._f_lane_currency)
                            self.write_formula(4, self.last_row,
                                               self._build_formula(self.last_row, 2, self.last_row, 3, "*"),
                                               self._f_lane_currency)
                            self.last_row += 1

            #sum rows
            f_footer_curr = self.workbook.add_format({'bold': True, 'align': 'right', 'bg_color': '6666FF',
                                             'font_color': 'black', 'num_format': 0x2a})
            f_footer = self.workbook.add_format({'bold': True, 'align': 'right', 'bg_color': '6666FF',
                                        'font_color': 'black'})
            self._write_cell(0, self.last_row, 'Suma', f_footer)
            self._write_cell(1, self.last_row, '', f_footer)
            self.write_formula(2, self.last_row,
                               self._build_formula(start_of_sum, 2, self.last_row-1, 2, "SUM"),
                               f_footer)
            self._write_cell(3, self.last_row, '', f_footer_curr)
            self.write_formula(4, self.last_row,
                               self._build_formula(start_of_sum, 4, self.last_row - 1, 4, "SUM"),
                               f_footer_curr)
