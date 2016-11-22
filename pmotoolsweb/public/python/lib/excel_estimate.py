import lib.excelfile

from xlsxwriter.utility import xl_rowcol_to_cell

gl_col_width = []

class ExcelEstimate (lib.excelfile.ExcelFile):

    def __init__(self, workbook_name, worksheet_name, in_memory):
        lib.excelfile.ExcelFile.__init__(self, workbook_name, worksheet_name, in_memory)

    def init_report(self, project_data):
        lib.excelfile.ExcelFile.init_report(self)

        self._configure_header_format('6666FF', 'black', True)
        self._configure_tc_format()

        self.col_widths = {"0": 80, "1": 18, "2": 12, "3": 10, "4": 14}

        self.data = project_data
        self.last_row = 2

        self.write_top_header()
        self.write_report_header()

    def _configure_tc_format(self):
        self._format_tc = self.workbook.add_format()
        self._format_tc.set_bg_color('white')
        self._format_tc.set_border(1)

    def write_top_header(self):
        for i in range(2):
            for j in range(5):
                self._write_cell(j, i, "", self._format_lane, True)

        self.insert_image('A1', 'logo.png')
        company_header = ["DreamLab Spółka z o.o.", "ul. Pilotów 10, 31-462 Kraków",
                         "Tel./Fax: +48 12 618 46 00, Email: office@dreamlab.pl",
                         "Sąd Rejestrowy: Sąd Rejonowy dla Krakowa Śródmieścia",
                         "XI  Wydział Gospodarczy Krajowego Rejestru Sądowego",
                         "KRS: 0000258095, Kapitał zakładowy: 50 000,00 zł",
                         "NIP: 675-13-44-074, Regon: 120260774"]

        span = 3
        for i, elem in enumerate(company_header):
            for j in range(span):
                self._write_cell(j, self.last_row, "", self._format_lane, True)
            lane_format = self._format_lane_right
            if i == 0:
                lane_format = self._format_lane_right_bold
            self._write_cell(span+1, self.last_row, elem, lane_format)
            self.last_row += 1

        project_header = ["Załącznik nr 2 do Porozumienia Wykonawczego nr ………..",
                         "Kosztorys prac projektu " + self.data['projectName']]

        for i, elem in enumerate(project_header):
            self._write_cell(0, self.last_row, elem, self._format_lane_bold)
            self.last_row += 1

        # set one line break
        self.last_row += 1

    def write_report_header(self):
        headers = ["Zadanie", "Rola w projekcie", "Roboczogodziny", "Stawka godzinowa netto", "Wycena netto"]
        self.last_row = self._write_table_header(self.last_row, headers, self._format_header)

    def _build_formula(self, row1, col1, row2, col2, sign):
        cellA = xl_rowcol_to_cell(row1, col1)
        cellB = xl_rowcol_to_cell(row2, col2)
        if sign == 'SUM':
            return 'SUM(' + cellA + ':' + cellB + ')'
        return '=' + cellA + sign + cellB

    def write_task_list(self, show_subtasks=False):
        if self.data['issues'] is not None:
            start_of_sum = self.last_row
            for k in self.data['issues']:
                main_issue = self.data['issues'][k]
                #TODO obsłużyć case zaraportowania w główne zadanie
                #parent
                ts = int(main_issue["timespent"] * 10)
                is_reported = main_issue['totaltimespent'] > 0
                has_children = len(self.data['issues'][k]['children']) != 0

                if (not show_subtasks and is_reported)\
                        or (show_subtasks and not has_children and is_reported)\
                        or (show_subtasks and ts > 0):
                    self._write_cell(0, self.last_row, main_issue['summary'], self._format_tc)
                    self._write_cell(1, self.last_row, "Programista", self._format_tc)
                    if ts > 0 and show_subtasks:
                        self._write_cell(2, self.last_row, main_issue['timespent'], self._format_tc)
                    else:
                        self._write_cell(2, self.last_row, main_issue['totaltimespent'], self._format_tc)
                    self._write_cell(3, self.last_row, 107, self._format_lane_currency)
                    self.write_formula(4, self.last_row,
                                       self._build_formula(self.last_row, 2, self.last_row, 3, "*"),
                                       self._format_lane_currency)
                    self.last_row += 1
                #wypisz wszystkie subtaski
                if show_subtasks:
                    for sub_issue in self.data['issues'][k]['children']:
                        if sub_issue['totaltimespent'] > 0:
                            self._write_cell(0, self.last_row, main_issue['summary'] + " - "
                                             + sub_issue['summary'], self._format_tc)
                            self._write_cell(1, self.last_row, "Programista", self._format_tc)
                            self._write_cell(2, self.last_row, sub_issue['totaltimespent'], self._format_tc)
                            self._write_cell(3, self.last_row, 107, self._format_lane_currency)
                            self.write_formula(4, self.last_row,
                                               self._build_formula(self.last_row, 2, self.last_row, 3, "*"),
                                               self._format_lane_currency)
                            self.last_row += 1

            #sum rows
            self._write_cell(0, self.last_row, 'Suma', self._format_header)
            self._write_cell(1, self.last_row, '', self._format_header)
            self.write_formula(2, self.last_row,
                               self._build_formula(start_of_sum, 2, self.last_row-1, 2, "SUM"),
                               self._format_header)
            self._write_cell(3, self.last_row, '', self._format_header)
            self.write_formula(4, self.last_row,
                               self._build_formula(start_of_sum, 4, self.last_row - 1, 4, "SUM"),
                               self._format_header)
