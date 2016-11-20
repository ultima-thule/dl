import lib.excelfile
import operator

from xlsxwriter.utility import xl_rowcol_to_cell

gl_col_width = []

class ExcelEstimate (lib.excelfile.ExcelFile):

    def __init__(self, workbook_name, worksheet_name):
        lib.excelfile.ExcelFile.__init__(self, workbook_name, worksheet_name, False)

    def init_report(self, project_data):
        lib.excelfile.ExcelFile.init_report(self)

        self._configure_header_format('6666FF', 'black', True)

        self.col_widths = {"0": 80, "1": 18, "2": 12, "3": 10, "4": 14}

        self.data = project_data
        self.last_row = 2

        self.write_top_header()
        self.write_report_header()

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

    def write_task_list(self, show_subtasks=False):
        if self.data['issues'] is not None:
            for k in self.data['issues']:
                main_issue = self.data['issues'][k]
                #TODO obsłużyć case zaraportowania w główne zadanie
                if not show_subtasks or (show_subtasks and len(self.data['issues'][k]['children'])==0):
                    self._write_cell(0, self.last_row, main_issue['summary'], self._format_lane)
                    self._write_cell(1, self.last_row, "Programista", self._format_lane)
                    self._write_cell(2, self.last_row, main_issue['timespent'], self._format_lane)
                    self._write_cell(3, self.last_row, 107, self._format_lane_currency)
                    cellA = xl_rowcol_to_cell(self.last_row, 2)
                    cellB = xl_rowcol_to_cell(self.last_row, 3)
                    self.write_formula(4, self.last_row, '=' + cellA + "*" + cellB, self._format_lane_currency)
                    self._write_cell(5, self.last_row, main_issue['type'], self._format_lane_currency)
                    self.last_row += 1
                else:
                    for sub_issue in self.data['issues'][k]['children']:
                        self._write_cell(0, self.last_row, main_issue['summary'] + " - "
                                         + sub_issue['summary'], self._format_lane)
                        self._write_cell(1, self.last_row, "Programista", self._format_lane)
                        self._write_cell(2, self.last_row, sub_issue['timespent'], self._format_lane)
                        self._write_cell(3, self.last_row, 107, self._format_lane_currency)
                        cellA = xl_rowcol_to_cell(self.last_row, 2)
                        cellB = xl_rowcol_to_cell(self.last_row, 3)
                        self.write_formula(4, self.last_row, '=' + cellA + "*" + cellB, self._format_lane_currency)
                        self._write_cell(5, self.last_row, sub_issue['type'], self._format_lane_currency)
                        self.last_row += 1
